import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'
import { ensureFirebaseInitialised } from '../../server-utils/firebaseAdminSDKInit'

ensureFirebaseInitialised()

/**
 * This api route is called with a POST request. It ignores any body content, and just works on the firebase token in the authorisation header.
 * If this token is valid and belongs to a user who has the field `role` set 'admin' in their firestore users collection document, it adds the custom claim {role: 'admin'} to their firebase user
 * On success it returns 200, on failure it returns a 4XX code for a bad request or a 5XX code if it encounters an error.
 */
export default async (req, res) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		return res.status(405).end('Method Not Allowed - Must Be POST')
	}

	const decodedToken = await asyncDecodeFirebaseToken(req?.headers?.authorization)
	if (!decodedToken) {
		console.warn('set-admin-claim endpoint: Called without valid token.')
		return res.status(401).end('Not Authorised')
	}

	const usersRef = firebaseService.collection('users')
	const docRef = usersRef.doc(decodedToken.uid)

	try {
		const doc = await docRef.get()
		if (!doc.exists || doc.data().role !== 'admin') {
			console.warn(
				'set-admin-claim endpoint: Attempt to set claim for user without admin role in users collection.  User uid: ',
				decodedToken.uid
			)
			return res.status(403).end('Forbidden')
		}

		// Valid user, authorise here.
		try {
			await firebaseAdmin.auth().setCustomUserClaims(decodedToken.uid, { role: 'admin' })
			return res.status(200).end('OK')
		} catch (error) {
			console.error('set-admin-claim endpoint: Error setting admin claim:", error')
			return res.status(502).end('Bad Gateway')
		}
	} catch (error) {
		console.error('set-admin-claim endpoint: Error getting users document:", error')
		return res.status(502).end('Bad Gateway')
	}
}
