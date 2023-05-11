import getHardcodedProductData from '../../utils/getHardcodedProductData'
import processConfiguration from '../../utils/processConfiguration'
import flattenObject from '../../utils/flattenObject'
import asyncFetchAndProcessProducts from '../../server-utils/fetchAndProcessProducts'
import { saveConfiguration } from '../../server-utils/saveAndGetConfigurations'
import { stripe } from '../../server-utils/initStripe'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, unitName, formData } = req.body
		if (productFamily && productFamily.length > 0 && unitName && formData) {
			let key
			try {
				/** @var {Object} freshProductData A trusted copy of the product data from the database, for the configuration options received from client side */
				const freshProductData = await asyncFetchAndProcessProducts(productFamily)
				// getHardcodedProductData pulls from an env variable to translate productFamily to the product display name - do this to ensure that the name we display for a purchase line item matches the skus that are part of it
				// Can't prevent someone from passing junk into this api, but at least anything that comes out of it should have a price and skus which match its name.
				const hardcodedProductData = getHardcodedProductData()
				const configuration = processConfiguration(
					hardcodedProductData[productFamily].name,
					freshProductData.products,
					freshProductData.extensions,
					formData,
					unitName
				)
				key = await saveConfiguration(configuration)
				const name = `${configuration.summary.product}${
					configuration.summary.extensions.length > 0 ? ' ' + configuration.summary.extensions : ''
				}`

				//Stripe
				/*
					This code accomplishes the following:

					Retrieves the product with the provided key. If the product doesn't exist, it creates a new one (creating a new product is the main path).
					Checks if the name or metadata of the product has changed. If so, it updates the product.
					Retrieves the active prices associated with the product.
					If no active prices exist, it creates a new one.
					If active prices exist, it checks if they have changed or if they are not the default price. If so, it sets them to inactive and creates a new price if the default price has changed.
					If a new product or price was created, it updates the default price of the product to the new active price.
				*/

				let newProductOrPrice = false
				// Define product and price configuration
				const productConfig = {
					id: key,
					name: name,
					metadata: flattenObject(configuration),
				}

				const priceConfig = {
					product: key,
					unit_amount: Math.round(configuration.price * 100), // Stripe works with the smallest currency unit
					currency: 'gbp',
				}

				let product
				try {
					// Attempt to create a new product - we expect to create a new product in most cases.
					product = await stripe.products.create(productConfig)
					newProductOrPrice = true
				} catch (err) {
					if (err.type === 'StripeInvalidRequestError') {
						// If the product already exists, retrieve the existing one
						product = await stripe.products.retrieve(key)
					} else {
						throw err // If the error is not due to an existing product, rethrow the error
					}
				}

				// Check if product fields have changed and update if necessary
				if (
					product.name !== productConfig.name ||
					JSON.stringify(product.metadata) !== JSON.stringify(productConfig.metadata)
				) {
					const { id, ...updateConfig } = productConfig // Exclude id from update parameters
					product = await stripe.products.update(product.id, updateConfig) // Update the product if the name or metadata has changed
				}

				// Retrieve prices associated with product
				let prices = await stripe.prices.list({ product: product.id, active: 'true' })

				// If price doesn't exist, create it
				if (!prices.data.length) {
					// If there are no active prices, create a new one with the provided configuration
					prices.data.push(await stripe.prices.create(priceConfig))
					newProductOrPrice = true
				} else {
					// If price exists, check if it has changed and delete/create if necessary
					let newPrice
					prices.data = await Promise.all(
						prices.data.map(async (price) => {
							if (
								price.id !== product.default_price ||
								price.unit_amount !== priceConfig.unit_amount ||
								price.currency !== priceConfig.currency
							) {
								if (price.id === product.default_price) {
									// If the price is the default price and it has changed, unset the default_price of the product and create a new price
									await stripe.products.update(product.id, { default_price: null })
									newPrice = await stripe.prices.create(priceConfig)
									newProductOrPrice = true
								}
								// Set the price to inactive if it's not the default price or if it has changed
								await stripe.prices.update(price.id, { active: 'false' })
								return newPrice
							}
							return price // If the price has not changed, keep it in the list
						})
					)
					if (newPrice) {
						// If a new price was created, add it to the list of prices
						prices.data.push(newPrice)
					}
				}

				if (newProductOrPrice) {
					// If a new product or price was created, set the default_price of the product to the id of the new active price
					const newDefaultPrice = prices.data.find((price) => price.active)
					if (!newDefaultPrice) {
						throw new Error('This should never happen')
					}
					product = await stripe.products.update(product.id, { default_price: newDefaultPrice.id })
				}

				console.log(product)
				console.log(prices.data)
			} catch (error) {
				console.error(error)
				return res.status(500).json({ message: 'An error occurred when fetching or processing data.' })
			}

			res.status(200).json({ key: key })
		} else {
			res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed.' })
	}
}
