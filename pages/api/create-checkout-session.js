const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import { asyncGetConfiguration } from '../../server-utils/saveAndGetConfigurations'
import flattenObject from '../../utils/flattenObject'

export default async (req, res) => {
	if (req.method === 'POST') {
		try {
			const cartFromClientSide = req.body

			const trustedProductData = Object.fromEntries(
				await Promise.all(cartFromClientSide.items.map(async (item) => [item.id, await asyncGetConfiguration(item.id)]))
			)

			// Create an array of line items for the Stripe checkout session
			const line_items = Object.keys(trustedProductData).map((id) => {
				const item = trustedProductData[id]

				const itemName = `${item.summary.product}${item.summary.extensions ? ' ' + item.summary.extensions : ''}`
				const priceInPence = Math.round(item.price * 100)
				// untrusted data from the client, just using it for the cart quantity
				const cartItem = cartFromClientSide.items.find((item) => item.id === id)
				const quantity = cartItem ? cartItem.quantity : 0

				return {
					price_data: {
						currency: process.env.NEXT_PUBLIC_CURRENCY_LC,
						product_data: {
							name: itemName,
							metadata: {
								internalId: id,
								type: item.type,
								units: item.units,
								years: item.years,
								skus: item.skus,
							},
						},
						unit_amount: priceInPence,
					},
					quantity,
				}
			})

			// Create a Stripe checkout session
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ['card'],
				line_items,
				mode: 'payment',
				success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${req.headers.origin}/cancel`,
			})

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
