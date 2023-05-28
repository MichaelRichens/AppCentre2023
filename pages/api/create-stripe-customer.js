import { stripe } from '../../server-utils/initStripe'

export default async function handler(req, res) {
	// Check request method
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed. This endpoint accepts POST requests only.' })
		return
	}

	// Validate email
	const { email } = req.body
	if (!email || !email.includes('@')) {
		res.status(400).json({ error: 'Invalid email address.' })
		return
	}

	try {
		const customer = await stripe.customers.create({ email })
		res.status(200).json({ customerId: customer.id })
	} catch (error) {
		console.error('Failed to create Stripe customer for email:', email, error)

		// Use error.message if it exists, else use a default message
		const errorMessage = error.message || 'Failed to create Stripe customer'
		res.status(500).json({ error: errorMessage })
	}
}
