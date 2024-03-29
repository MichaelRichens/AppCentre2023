import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app
let auth
let firestore

if (typeof window !== 'undefined' && !getApps().length) {
	app = initializeApp(firebaseConfig)
	auth = getAuth(app)
	firestore = getFirestore(app)
}

const translateFirebaseError = (error) => {
	const errorMessages = {
		'auth/credential-already-in-use': 'We already have an account with this email.',
		'auth/email-already-in-use': 'This email address is already in use. Please use a different email address.',
		'auth/invalid-email': 'The email address you entered is not valid. Please enter a valid email address.',
		'auth/missing-password': 'Please enter your password.',
		'auth/operation-not-allowed': 'This operation is not allowed. Please contact support for assistance.',
		'auth/requires-recent-login': 'Sorry, to perform this operation you must log out and log back in.',
		'auth/too-many-requests': 'We have detected too many requests from your device. Please try again later.',
		'auth/user-disabled': 'This user account has been disabled. Please contact support for assistance.',
		'auth/user-not-found':
			'There is no user associated with this email address. If you had an account from before June 2023, very sorry but this has not been transferred to the new site and you will need to create a new account.  Please contact us if you need copies of old invoices',
		'auth/weak-password': 'The password you entered is too weak. Please choose a stronger password.',
		'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
	}

	const lookedUpMessage = errorMessages[error?.code] || false
	if (lookedUpMessage) {
		return lookedUpMessage
	}
	console.error('Firebase error without user friendly message received: ', error)
	return 'Sorry, an error occurred. Please try again.'
}

export { auth, firestore, translateFirebaseError }
