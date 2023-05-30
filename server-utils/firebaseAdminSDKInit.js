// firebaseAdmin.js
import * as admin from 'firebase-admin'

//I'm getting a bit confused about firebase initialisation.  I'm importing and calling this into all api routes to be damn sure its running.  Maybe overkill.
export function ensureFirebaseInitialised() {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
			}),
			databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
		})
	}
}
