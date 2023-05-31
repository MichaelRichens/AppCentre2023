import { ensureFirebaseInitialised } from './firebaseAdminSDKInit'
import * as firebaseAdmin from 'firebase-admin'

ensureFirebaseInitialised()

/**
 * Helper function to decode the firebase token passed in a request authorisation header.
 * @param {string} authorization The authorisation header
 * @returns {Promise<string|false|null>} The decoded token if successful, null if the authorisation header was malformed, false if the authorisation token failed verification
 */
async function asyncDecodeFirebaseToken(authorization) {
	authorization = authorization || ''

	const components = authorization.split(' ')

	if (components.length !== 2 || components[0] !== 'Bearer') {
		console.warn('Invalid authorization header format. Expecting "Bearer <token>".')
		return null
	}

	const token = components[1]

	let decodedToken

	try {
		// Verify the ID token using the Firebase Admin SDK
		decodedToken = await firebaseAdmin.auth().verifyIdToken(token)
		return decodedToken
	} catch (error) {
		console.warn('Error when verifying token with firebase', error)
		return false
	}
}

export default asyncDecodeFirebaseToken
