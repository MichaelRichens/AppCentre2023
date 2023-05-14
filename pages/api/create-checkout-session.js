// Import the Stripe library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
	if (req.method === 'POST') {
		try {
			const cart = req.body // This should be the cart information sent from the client

			// Create an array of line items for the Stripe checkout session
			const line_items = cart.items.map((item) => ({
				price_data: {
					currency: process.env.NEXT_PUBLIC_CURRENCY_LC,
					product_data: {
						name: item.name,
						images: [item.image],
					},
					unit_amount: item.price,
				},
				quantity: item.quantity,
			}))

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
			res.status(500).json({ statusCode: 500, message: error.message })
		}
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
}
