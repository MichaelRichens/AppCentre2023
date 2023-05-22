import { stripe } from '../../server-utils/initStripe'
import { asyncGetConfiguration } from '../../server-utils/saveAndGetConfigurations'

export default async (req, res) => {
	if (req.method === 'POST') {
		try {
			const cartFromClientSide = req.body

			if (!cartFromClientSide || !Array.isArray(cartFromClientSide.items)) {
				console.error('Invalid request body. Expected "items" array.')
				return res.status(400).json({ message: "Invalid request body. Expected 'items' array." })
			}

			let trustedProductData
			try {
				trustedProductData = Object.fromEntries(
					await Promise.all(
						cartFromClientSide.items.map(async (item) => [item.id, await asyncGetConfiguration(item.id)])
					)
				)
			} catch (error) {
				console.error('Failed to fetch fresh product data from the database.', error)
				throw error
			}

			// do we have anything to ship

			let isShipping = false

			for (let key in trustedProductData) {
				if (trustedProductData[key].hasOwnProperty('isShipping') && trustedProductData[key].isShipping === true) {
					isShipping = true
					break
				}
			}
			// create shipping properties for session object
			let shipping_address_collection = null
			if (isShipping) {
				shipping_address_collection = { allowed_countries: process.env.NEXT_PUBLIC_SHIPPING_COUNTRIES.split(',') }
			}

			// Create an array of line items for the Stripe checkout session
			const line_items = Object.keys(trustedProductData).map((id) => {
				const item = trustedProductData[id]
				const itemName = item.description

				if (!item || !item.summary || !item.summary || !item.price || !itemName || typeof item.price !== 'number') {
					console.error(`Invalid product data for ID ${id}`)
					throw new Error(`Invalid product data for ID ${id}`)
				}

				const priceInPence = Math.round(item.price * 100)

				// untrusted data from the client, just using it for the cart quantity
				const cartItem = cartFromClientSide.items.find((item) => item.id === id)
				if (!cartItem || typeof cartItem.quantity !== 'number' || cartItem.quantity < 1) {
					throw new Error(`Invalid quantity for cart item with ID ${id}`)
				}
				const quantity = cartItem.quantity

				const metadata = {
					internalId: id,
					configuration: item.unType,
					units: item.units,
					years: item.years,
					skus: JSON.stringify(item.skus),
				}

				return {
					price_data: {
						currency: process.env.NEXT_PUBLIC_CURRENCY_LC,
						product_data: {
							name: itemName,
							metadata,
						},
						unit_amount: priceInPence,
					},
					quantity,
				}
			})

			let sessionCreationObj = {
				payment_method_types: ['card'],
				line_items,
				mode: 'payment',
				success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/cancel`,
				billing_address_collection: 'required',
				invoice_creation: {
					enabled: true,
					invoice_data: {
						/*account_tax_ids: [process.env.NEXT_PUBLIC_VAT_NUMBER],*/
						footer: `AppCentre is a trading name of Second Chance PC Ltd.  Company Number: ${process.env.NEXT_PUBLIC_COMPANY_NUMBER}. Registered for VAT: ${process.env.NEXT_PUBLIC_VAT_NUMBER}. E&OE.`,
						rendering_options: {
							amount_tax_display: 'exclude_tax',
						},
					},
				},
				submit_type: 'pay',
			}

			if (isShipping) {
				sessionCreationObj['shipping_address_collection'] = shipping_address_collection
			}

			let session

			try {
				// Create a Stripe checkout session
				session = await stripe.checkout.sessions.create(sessionCreationObj)
			} catch (stripeError) {
				// Handle errors from the Stripe API separately
				console.error('Stripe API Error:', stripeError)
				return res.status(500).json({ message: `Stripe API error: ${stripeError.message}` })
			}

			// Return the session ID
			res.status(200).json({ sessionId: session.id })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ statusCode: 500, message: error.message })
		}
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed - must be POST')
	}
}
