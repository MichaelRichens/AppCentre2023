import { buffer } from 'micro'
import { stripe } from '../../server-utils/initStripe'

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const buf = await buffer(req)
		const sig = req.headers['stripe-signature']
		let event

		try {
			event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SIGNING_SECRET)
		} catch (error) {
			console.log(`Error verifying webhook signature: ${error.message}`)
			return res.status(400).send(`Webhook Error: ${error.message}`)
		}

		switch (event.type) {
			case 'payment_intent.succeeded':
				const paymentIntent = event.data.object
				console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}, Amount: ${paymentIntent.amount}`)
				break
			case 'customer.updated':
				const updatedCustomer = event.data.object
				console.log(`Customer was updated! ID: ${updatedCustomer.id}, Email: ${updatedCustomer.email}`)
				break
			case 'customer.deleted':
				const deletedCustomer = event.data.object
				console.log(`Customer was deleted! ID: ${deletedCustomer.id}`)
				break
			case 'payment_intent.payment_failed':
				const failedPaymentIntent = event.data.object
				console.log(`PaymentIntent failed! ID: ${failedPaymentIntent.id}`)
				break
			case 'charge.refunded':
				const refundedCharge = event.data.object
				console.log(`Charge was refunded! ID: ${refundedCharge.id}, Amount refunded: ${refundedCharge.amount_refunded}`)
				break
			case 'checkout.session.completed':
				const completedSession = event.data.object
				console.log(`Checkout session was completed! ID: ${completedSession.id}`)
				break
			case 'dispute.created':
				const dispute = event.data.object
				console.log(`A dispute was created! ID: ${dispute.id}`)
				break
			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		// Return a response to acknowledge receipt of the event
		res.json({ received: true })
	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
}
