import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, serverTimestamp, setDoc, updateDoc, doc } from 'firebase/firestore'

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
		'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
		'auth/missing-password': 'Please enter your password.',
		'auth/user-not-found': 'There is no user associated with this email address.',
		'auth/invalid-email': 'The email address you entered is not valid. Please enter a valid email address.',
		'auth/email-already-in-use': 'This email address is already in use. Please use a different email address.',
		'auth/user-disabled': 'This user account has been disabled. Please contact support for assistance.',
		'auth/weak-password': 'The password you entered is too weak. Please choose a stronger password.',
		'auth/operation-not-allowed': 'This operation is not allowed. Please contact support for assistance.',
		'auth/too-many-requests': 'We have detected too many requests from your device. Please try again later.',
		// Add more error codes as needed...
	}

	const lookedUpMessage = errorMessages[error?.code] || false
	if (lookedUpMessage) {
		return lookedUpMessage
	}
	console.error('Firebase error without user friendly message received: ', error)
	return 'Sorry, an error occurred. Please try again.'
}

// Wrapper function for setDoc
async function createDocument(path, data) {
	const docRef = doc(firestore, path)
	const timestamp = serverTimestamp()

	const docData = {
		...data,
		createdAt: timestamp,
		updatedAt: timestamp,
	}

	await setDoc(docRef, docData)
}

// Wrapper function for updateDoc
async function updateDocument(path, data) {
	const docRef = doc(firestore, path)

	const docData = {
		...data,
		updatedAt: serverTimestamp(),
	}

	await updateDoc(docRef, docData)
}

export { auth, firestore, createDocument, updateDocument, translateFirebaseError }
