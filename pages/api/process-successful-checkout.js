import { stripe } from '../../server-utils/initStripe'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { sessionId } = req.body
			if (!sessionId) {
				return res.status(400).json({ error: 'Incomplete request' })
			}

			try {
				const session = await stripe.checkout.sessions.retrieve(sessionId)
				console.log(session)

				const { invoice } = session
				console.log(invoice)

				res.status(200).json('ok') // Respond with the session data
			} catch (error) {
				error.log('Error retrieving session from Stripe', error)
				res.status(500).json({ statusCode: 500, message: error.message })
			}
		} catch (error) {
			console.error('An error occurred:', error)
			return res.status(500).json({ statusCode: 500, message: error.message })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		return res.status(405).end(`Method ${req.method} Not Allowed, must be POST`)
	}
}
