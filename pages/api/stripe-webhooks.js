import { buffer } from 'micro'
import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import { stripe } from '../../server-utils/initStripe'
import OrderStatus from '../../utils/types/enums/OrderStatus'

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
			case 'charge.refunded':
				const refundedCharge = event.data.object
				console.log(`Charge was refunded! ID: ${refundedCharge.id}, Amount refunded: ${refundedCharge.amount_refunded}`)
				break
			case 'checkout.session.completed':
				const completedSession = event.data.object
				//console.log('checkout.session.completed object:', completedSession)
				try {
					const ordersRef = firebaseService.collection('orders')

					const querySnapshot = await ordersRef.where('sessionId', '==', completedSession.id).get()

					if (!querySnapshot.empty) {
						if (querySnapshot.docs.length > 1) {
							console.error(
								`Webhook checkout.session.completed - More than one order with the same stripe session id found (${querySnapshot.docs.length} found). Session id: ${completedSession.id}`
							)
						}
						const doc = querySnapshot.docs[0] // We'll just update the first matching document since there should only be 1
						await doc.ref.update({
							status: OrderStatus.PAID,
							updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
						})
					} else {
						console.error(
							`Webhook checkout.session.completed - No matching order found for stripe session id: ${completedSession.id}`
						)
						return res.status(404).json({ error: 'No matching order found' })
					}
				} catch (error) {
					console.error(
						`Webhook checkout.session.completed - Unable to complete order for stripe session complete webhook with session is: ${completedSession.id}`,
						error
					)
					return res.status(500).json({ error: 'Unable to complete order.' })
				}
				break
			case 'checkout.session.expired':
				const expiredSession = event.data.object

				try {
					const ordersRef = firebaseService.collection('orders')

					const querySnapshot = await ordersRef.where('sessionId', '==', expiredSession.id).get()

					if (!querySnapshot.empty) {
						if (querySnapshot.docs.length > 1) {
							console.error(
								`Webhook: checkout.session.expired - More than one order with the same stripe session id found (${querySnapshot.docs.length} found). Session id: ${expiredSession.id}`
							)
						}
						const doc = querySnapshot.docs[0] // We'll just update the first matching document since there should only be 1
						await doc.ref.update({
							status: OrderStatus.EXPIRED,
							updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
						})
					} else {
						console.error(
							`Webhook: checkout.session.expired - No matching order found for stripe session id: ${expiredSession.id}`
						)
						return res.status(404).json({ error: 'No matching order found' })
					}
				} catch (error) {
					console.error(
						`Webhook: checkout.session.expired - Unable to update order for stripe session id: ${expiredSession.id}`,
						error
					)
					return res.status(500).json({ error: 'Unable to expire order.' })
				}

				break
			case 'customer.created':
				const createdCustomer = event.data.object
				//console.log('customer.created object:', createdCustomer)
				console.log(`Customer was updated! ID: ${createdCustomer.id}, Email: ${createdCustomer.email}`)
				break
			case 'customer.deleted':
				const deletedCustomer = event.data.object
				try {
					// Query Firestore for any users with the deleted customer's ID
					// Should only ever be 1, but might as well handle duplicates while we're at it
					const usersSnapshot = await firebaseService
						.collection('users')
						.where('stripeCustomerId', '==', deletedCustomer.id)
						.get()

					// Remove the stripeCustomerId field from each matched user
					const updatePromises = usersSnapshot.docs.map((doc) => {
						return firebaseService.collection('users').doc(doc.id).update({
							stripeCustomerId: firebaseAdmin.firestore.FieldValue.delete(),
						})
					})

					// Wait for all updates to complete
					await Promise.allSettled(updatePromises)
				} catch (error) {
					console.error(
						`Customer Delete Error for stripe customer id ${deletedCustomer.id}. Error updating Firestore documents:`,
						error
					)
					return res.status(500).json({ error: 'Error deleting customer.' })
				}
				break
			case 'customer.updated':
				const updatedCustomer = event.data.object
				console.log(`Customer was updated! ID: ${updatedCustomer.id}, Email: ${updatedCustomer.email}`)
				break
			case 'dispute.created':
				const dispute = event.data.object
				console.log(`A dispute was created! ID: ${dispute.id}`)
				break
			case 'payment_intent.payment_failed':
				const failedPaymentIntent = event.data.object
				console.log(`PaymentIntent failed! ID: ${failedPaymentIntent.id}`)
				break
			case 'payment_intent.succeeded':
				const paymentIntent = event.data.object
				console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}, Amount: ${paymentIntent.amount}`)
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
