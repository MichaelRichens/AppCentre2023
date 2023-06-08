import { buffer } from 'micro'
import sgMail from '@sendgrid/mail'
import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import { stripe } from '../../server-utils/initStripe'
import { OrderStatus } from '../../utils/types/enums/OrderStatus'
import asyncLinkStripeCustomerUsingSession from '../../server-utils/asyncLinkStripeCustomerUsingSession'
import { ensureFirebaseInitialised } from '../../server-utils/firebaseAdminSDKInit'

ensureFirebaseInitialised()

export const config = {
	api: {
		bodyParser: false,
	},
}

// This handler processes stripe webhook events, which are used to update orders and customers.

// There is a division of responsibility between the 'checkout.session.completed' handler and the success page the user gets sent to after checkout.
// 'checkout.session.completed' is for updating order statuses, and also for managing linking of stripe customers with firebase users
// (ie adding the stripe customer if into the users firebase document in the users collection)
// The checkout success page handles clearing the cart
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

	switch (event.type) {
		case 'charge.refunded':
			const refundedCharge = event.data.object

			if (!refundedCharge?.payment_intent) {
				console.error('Webhook: charge.refunded - refundedCharge.payment_intent not set:', refundedCharge)
				return res.status(500).end()
			}

			if (refundedCharge?.refunded === undefined) {
				console.error('Webhook: charge.refunded - did not have a refunded property:', refundedCharge)
				return res.status(500).end()
			}

			if (refundedCharge?.amount_refunded === undefined) {
				console.error('Webhook: charge.refunded - did not have a amount_refunded property:', refundedCharge)
				return res.status(500).end()
			}

			if (refundedCharge.amount_refunded <= 0) {
				console.warn('Webhook: charge.refunded - had a non-positive amount_refunded property:', refundedCharge)
				return res.status(500).end()
			}

			const ordersRef = firebaseService.collection('orders')

			const querySnapshot = await ordersRef.where('paymentIntentId', '==', refundedCharge.payment_intent).get()

			if (querySnapshot.empty) {
				console.error(
					'Webhook charge.refunded - No matching order found for payment_intent on this charge:',
					refundedCharge
				)
				return res.status(500).end()
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
				refundedAmount: refundedCharge.amount_refunded / 100,
				updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
			})

			break
		case 'checkout.session.completed':
			const completedSession = event.data.object

			// update customer details (if needed) with current stripe id no matter what - this event is just a helpful method of linking them
			await asyncLinkStripeCustomerUsingSession(completedSession?.id, completedSession?.customer)
			if (!completedSession?.id) {
				console.error('Webhook: completedSession.id - completedSession.id not set')
				return res.status(500).end()
			}
			try {
				const ordersRef = firebaseService.collection('orders')

				const orderDocsSnap = await ordersRef.where('sessionId', '==', completedSession.id).get()

				if (orderDocsSnap.empty) {
					console.error(
						`Webhook checkout.session.completed - No matching order found for stripe session id: ${completedSession.id}`
					)
					return res.status(500).end()
				}
				if (orderDocsSnap.docs.length > 1) {
					// really should never happen, but non-fatal error
					console.error(
						`Webhook checkout.session.completed - More than one order with the same stripe session id found (${orderDocsSnap.docs.length} found). Session id: ${completedSession.id}`
					)
				}
				const orderDocSnap = orderDocsSnap.docs[0] // We'll just update the first matching document since there REALLY should only be 1

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

				const orderDocUpdateObj = {
					status: newOrderStatus,
					paymentIntentId: paymentIntentId,
					// Stripe prices are in pennies, so divide by 100.  Will end up with -1 as an error flag if field is not present
					priceSubTotal: (completedSession?.amount_subtotal || -100) / 100, // Stripe definition: Total of all items before discounts or taxes are applied.
					priceInc: (completedSession?.amount_total || -100) / 100, // Stripe definition: Total of all items after discounts and taxes are applied.
					updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				}

				const orderData = orderDocSnap.data()

				// cannot pass undefined fields to firestore update (according to error message I got anyway), hence all these if statements

				// we use address details from stripe for the order, since we don't handle these ourselves
				if (completedSession?.customer_details?.address) {
					orderDocUpdateObj.billingAddress = completedSession.customer_details.address
				}
				if (completedSession?.shipping_details?.address) {
					orderDocUpdateObj.shippingAddress = completedSession.shipping_details.address
				}
				if (completedSession?.shipping_details?.name) {
					orderDocUpdateObj.shippingAddress.name = completedSession.shipping_details.name
				}

				// If the order wasn't created (prior to checkout) with any name details on it (ie it was an anonymous order), then we add the stripe name field as the full name
				if ((!orderData?.fullName || !orderData?.businessName) && completedSession?.customer_details?.name) {
					orderDocUpdateObj.fullName = completedSession.customer_details.name
				}
				await orderDocSnap.ref.update(orderDocUpdateObj)

				// Send emails on success
				if (orderDocUpdateObj.status === OrderStatus.PAID) {
					// Send email to them
					if (completedSession?.customer_details?.email) {
						const toThemEmailBody = `
Dear ${orderData.fullName},

Thank you for your order with AppCentre. We appreciate your business.

Order Reference: ${orderData.orderId}
Order Total: £${orderDocUpdateObj.priceInc.toFixed(2)}

${
	orderData.isShipping
		? 'Please note that delivery normally takes around 7 - 10 working days.'
		: 'Please note that it normally takes around 2 working days for subscription changes to be processed.'
}

Thank you again for your order.

Kind regards,
The AppCentre Team`
						const toThemContent = {
							to: completedSession.customer_details.email,
							from: 'info@appcentre.co.uk',
							subject: `${process.env.NEXT_PUBLIC_INTERNAL_SITE_NAME} - Order Placed`,
							text: toThemEmailBody,
						}

						try {
							await sgMail.send(toThemContent)
						} catch (error) {
							console.error('Failed to send order email (to customer)', error)
							console.log('Errors array:')
							const errArray = error?.response?.body?.errors || []
							errArray.forEach((err) => {
								console.log(err)
							})
						}
					}

					// send email to us
					const toUsEmailBody = `
AppCentre order: ${orderData.orderId} placed for £${orderDocUpdateObj.priceInc?.toFixed(2)}.

Stripe session ID: ${orderData.sessionId}

Stripe Payment Intent ID: ${orderDocUpdateObj.paymentIntentId}

Customer Name: ${orderData.fullName}

Customer Email: ${completedSession?.customer_details?.email}

User ID: ${orderData.firebaseUserId}

Stripe Customer ID: ${orderData.stripeCustomerId}
					`

					const toUsContent = {
						to: 'info@appcentre.co.uk',
						from: 'info@appcentre.co.uk',
						subject: `${process.env.NEXT_PUBLIC_INTERNAL_SITE_NAME} - Order Placed`,
						text: toUsEmailBody,
					}

					try {
						await sgMail.send(toUsContent)
					} catch (error) {
						console.error('Failed to send order email (to us)', error)
						console.log('Errors array:')
						const errArray = error?.body?.errors || []
						errArray.forEach((err) => {
							console.log(err)
						})
					}
				}
			} catch (error) {
				console.error(
					`Webhook checkout.session.completed - Unable to complete order for stripe session complete webhook with session is: ${completedSession.id}`,
					error
				)
				return res.status(500).end()
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
					return res.status(500).end()
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
				return res.status(500).end()
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
				return res.status(500).end()
			}
			break
	}

	res.status(200).end()
}
