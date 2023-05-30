import * as firebaseAdmin from 'firebase-admin'
import firebaseService from './firebaseService'

/**
 * With a stripe customer id and a stripe session id, we can check if we have this stripe customer id associated with our user and their order, and if not make the link.
 * Doesn't return anything, it just checks if it needs to link the customer id to the order with the passed session and to the user that created it, and if so it does so.
 * Mostly useful with guest checkouts, but it might pick up and correct a few other issues here and there.
 *
 */
async function asyncLinkStripeCustomerUsingSession(sessionId, stripeCustomerId) {
	// Early exit on obviously bad arguments
	if (
		typeof sessionId !== 'string' ||
		sessionId.length === 0 ||
		typeof stripeCustomerId !== 'string' ||
		stripeCustomerId.length === 0
	) {
		return
	}
	try {
		// See if we can find the order from the session id
		const ordersRef = firebaseService.collection('orders')
		const querySnapshot = await ordersRef.where('sessionId', '==', sessionId).get()

		// If not, exit
		if (querySnapshot.empty) {
			return
		}

		if (querySnapshot.docs.length > 1) {
			// Multiple order with the same session id... Something is badly broken, just exit.
			console.error(
				`More than one order with the same stripe session id found (${querySnapshot.docs.length} found). Session id: ${sessionId}`
			)
			return
		}

		// Get the document
		const orderDoc = querySnapshot.docs[0]
		const orderData = orderDoc.data()

		// Check if the order does not have a matching customer id, and update it in this case
		if (orderData.stripeCustomerId !== stripeCustomerId) {
			if (orderData.stripeCustomerId !== undefined) {
				console.warn(
					`Order with checkout session id ${sessionId} had stripe customer id ${orderData.stripeCustomerId}, but stripe has provided customer id ${stripeCustomerId} for it.  This may indicate a problem somewhere...  Updating order (and user) to have the new customer id.`
				)
			}

			await orderDoc.ref.update({
				stripeCustomerId: stripeCustomerId,
				updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
			})
		}

		// Now see if we need to update the user
		const firebaseUserId = orderData.firebaseUserId

		// Get the user document
		const usersRef = firebaseService.collection('users')
		const userDocRef = usersRef.doc(firebaseUserId)
		const userDocSnapshot = await userDocRef.get()

		// If the user document doesn't exist, create a new one and we're done
		if (!userDocSnapshot.exists) {
			await userDocRef.set({
				stripeCustomerId: stripeCustomerId,
				createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
			})
			return
		}

		// Get the user data
		const userData = userDocSnapshot.data()

		// If the stripeCustomerId matches, we're done
		if (userData.stripeCustomerId === stripeCustomerId) {
			return
		}

		// Update the user record with the new stripe customer id
		await userDocRef.update({
			stripeCustomerId: stripeCustomerId,
			updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
		})
	} catch (error) {
		console.error('Error in asyncLinkStripeCustomerUsingSession:', error)
	}
}

export default asyncLinkStripeCustomerUsingSession
