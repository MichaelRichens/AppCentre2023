import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'

ensureFirebaseInitialised()

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
		} catch (error) {
			console.error('set-admin-claim endpoint: Error setting admin claim:", error')
			return res.status(502).end('Bad Gateway')
		}
	} catch (error) {
		console.error('set-admin-claim endpoint: Error getting users document:", error')
		return res.status(502).end('Bad Gateway')
	}
}
