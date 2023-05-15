const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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

			// Create an array of line items for the Stripe checkout session
			const line_items = Object.keys(trustedProductData).map((id) => {
				const item = trustedProductData[id]

				if (
					!item ||
					!item.summary ||
					!('product' in item.summary) ||
					!('extensions' in item.summary) ||
					typeof item.price !== 'number'
				) {
					console.error(`Invalid product data for ID ${id}`)
					throw new Error(`Invalid product data for ID ${id}`)
				}

				const itemName = `${item.summary.product}${item.summary.extensions ? ' ' + item.summary.extensions : ''}`
				const priceInPence = Math.round(item.price * 100)

				// untrusted data from the client, just using it for the cart quantity
				const cartItem = cartFromClientSide.items.find((item) => item.id === id)
				if (!cartItem || typeof cartItem.quantity !== 'number' || cartItem.quantity < 1) {
					throw new Error(`Invalid quantity for cart item with ID ${id}`)
				}
				const quantity = cartItem.quantity

				const metadata = {
					internalId: id,
					configuration: item.type,
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

			let session
			try {
				// Create a Stripe checkout session
				session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					line_items,
					mode: 'payment',
					success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
					cancel_url: `${req.headers.origin}/cancel`,
				})
			} catch (stripeError) {
				// Handle errors from the Stripe API separately
				console.error(stripeError)
				return res.status(500).json({ message: `Stripe API error: ${stripeError.message}` })
			}

			// Return the session ID
			res.status(200).json({ sessionId: session.id })
		} catch (error) {
			console.error(error)
			res.status(500).json({ statusCode: 500, message: error.message })
		}
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed - must be POST')
	}
}
