import { buffer } from 'micro'
import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import { stripe } from '../../server-utils/initStripe'
import OrderStatus from '../../utils/types/enums/OrderStatus'
import asyncLinkStripeCustomerUsingSession from '../../server-utils/asyncLinkStripeCustomerUsingSession'

export const config = {
	api: {
		bodyParser: false,
	},
}

// This handler processes stripe webhook events, which are used to update orders and customers.
// There is a division of responsibility between these handlers and the success page the user gets sent to after checkout.
// These events are used for updating order statuses, and also for managing linking of stripe customers with firebase users
// (ie adding the stripe customer if into the users firebase document in the users collection)
// The checkout success page handles clearing the cart, and also merging user details (eg addresses) that might have been given/updated during checkout back with our system
// Avoid duplicating responsibilities to avoid race conditions since many events will fire as the user is handed back to our site (also its less work...)

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
	const buf = await buffer(req)
	const sig = req.headers['stripe-signature']
	let event

	try {
		event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SIGNING_SECRET)
	} catch (error) {
		console.log(`Error verifying webhook signature: ${error.message}`)
		return res.status(401).send(`Webhook Verification Error: ${error.message}`)
	}

	// Message has been received and verified - return the received acknowledgement to stripe before processing it (as per their docs)
	res.status(202).end()

	//console.log(event.type, event.data.object)

	switch (event.type) {
		case 'charge.refunded':
			const refundedCharge = event.data.object

			if (!refundedCharge?.payment_intent) {
				console.error('Webhook: charge.refunded - refundedCharge.payment_intent not set:', refundedCharge)
				return
			}

			if (refundedCharge?.refunded === undefined) {
				console.error('Webhook: charge.refunded - did not have a refunded property:', refundedCharge)
				return
			}

			if (refundedCharge?.amount_refunded === undefined) {
				console.error('Webhook: charge.refunded - did not have a amount_refunded property:', refundedCharge)
				return
			}

			if (refundedCharge.amount_refunded <= 0) {
				console.warn('Webhook: charge.refunded - had a non-positive amount_refunded property:', refundedCharge)
				return
			}

			const ordersRef = firebaseService.collection('orders')

			const querySnapshot = await ordersRef.where('paymentIntentId', '==', refundedCharge.payment_intent).get()

			if (querySnapshot.empty) {
				console.error(
					'Webhook charge.refunded - No matching order found for payment_intent on this charge:',
					refundedCharge
				)
				return
			}

			if (querySnapshot.docs.length > 1) {
				// really should never happen, but non-fatal error
				console.error(
					`Webhook charge.refunded - More than one order with the paymentIntentId found (${querySnapshot.docs.length} found). paymentIntentId: ${paymentIntentId}`
				)
			}

			const doc = querySnapshot.docs[0] // We'll just update the first matching document since there REALLY should only be 1

			let newOrderStatus = refundedCharge.refunded ? OrderStatus.FULLY_REFUNDED : OrderStatus.PARTIALLY_REFUNDED

			await doc.ref.update({
				status: newOrderStatus,
				updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
			})

			break
		case 'checkout.session.completed':
			const completedSession = event.data.object

			// update customer details (if needed) with current stripe id no matter what - this event is just a helpful method of linking them
			await asyncLinkStripeCustomerUsingSession(completedSession?.id, completedSession?.customer)

			if (!completedSession?.id) {
				console.error('Webhook: completedSession.id - completedSession.id not set')
				return
			}

			try {
				const ordersRef = firebaseService.collection('orders')

				const querySnapshot = await ordersRef.where('sessionId', '==', completedSession.id).get()

				if (querySnapshot.empty) {
					console.error(
						`Webhook checkout.session.completed - No matching order found for stripe session id: ${completedSession.id}`
					)
					return
				}
				if (querySnapshot.docs.length > 1) {
					// really should never happen, but non-fatal error
					console.error(
						`Webhook checkout.session.completed - More than one order with the same stripe session id found (${querySnapshot.docs.length} found). Session id: ${completedSession.id}`
					)
				}
				const doc = querySnapshot.docs[0] // We'll just update the first matching document since there REALLY should only be 1

				const paymentIntentId = completedSession?.payment_intent
				// I'm not sure if stripe actually completes checkouts if the card doesn't go through, but we'll handle the possible statuses just in case
				let newOrderStatus
				switch (completedSession?.payment_status) {
					case 'paid':
						newOrderStatus = OrderStatus.PAID
						break
					case 'unpaid':
						newOrderStatus = OrderStatus.FAILED
						break
					case 'no_payment_required':
						newOrderStatus = OrderStatus.COMPLETE_NO_PAYMENT
						break
					default:
						newOrderStatus = OrderStatus.UPDATE_ERROR
				}

				await doc.ref.update({
					status: newOrderStatus,
					paymentIntentId: paymentIntentId,
					updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				})
			} catch (error) {
				console.error(
					`Webhook checkout.session.completed - Unable to complete order for stripe session complete webhook with session is: ${completedSession.id}`,
					error
				)
				return
			}
			break
		case 'checkout.session.expired':
			const expiredSession = event.data.object

			// update customer details (if needed) with current stripe id no matter what - this event is just a helpful method of linking them
			await asyncLinkStripeCustomerUsingSession(expiredSession?.id, expiredSession?.customer)

			try {
				const ordersRef = firebaseService.collection('orders')

				const querySnapshot = await ordersRef.where('sessionId', '==', expiredSession.id).get()

				if (querySnapshot.empty) {
					console.error(
						`Webhook: checkout.session.expired - No matching order found for stripe session id: ${expiredSession.id}`
					)
					return
				}
				if (querySnapshot.docs.length > 1) {
					// really should never happen, but non-fatal error
					console.error(
						`Webhook: checkout.session.expired - More than one order with the same stripe session id found (${querySnapshot.docs.length} found). Session id: ${expiredSession.id}`
					)
				}
				const doc = querySnapshot.docs[0] // We'll just update the first matching document since there REALLY should only be 1
				await doc.ref.update({
					status: OrderStatus.EXPIRED,
					updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				})
			} catch (error) {
				console.error(
					`Webhook: checkout.session.expired - Unable to update order for stripe session id: ${expiredSession.id}`,
					error
				)
				return
			}

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
				return
			}
			break
		case 'dispute.created':
			const dispute = event.data.object
			console.log(`Unhandled webhook received: A dispute was created! ID: ${dispute.id}`)
			break
		default:
			console.log(`Unhandled event type: ${event.type}`)
	}
}
