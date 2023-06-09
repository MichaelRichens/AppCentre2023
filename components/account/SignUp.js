import React, { useState, useContext } from 'react'
import { auth, firestore, translateFirebaseError } from '../../utils/firebaseClient'
import { createUserWithEmailAndPassword, EmailAuthProvider, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'
import accountStyles from '/styles/Account.shared.module.css'

function SignUp({ title, prefillEmail = '', prefillFullName = '' }) {
	const { anonymousUser, asyncUpgradeUser } = useAuth()
	const [email, setEmail] = useState(prefillEmail)
	const [password, setPassword] = useState('')
	const [fullName, setFullName] = useState(prefillFullName)
	const [businessName, setBusinessName] = useState('')
	const [formError, setFormError] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	const handleSubmit = async (event) => {
		event.preventDefault()

		// This will hold the new or upgraded user that we create
		let newOrUpgradedUser

		// validate the full name is at least 2 characters
		if (!fullName || fullName.length < 2) {
			setFormError('Your name must be at least 2 characters long.')
			return
		}

		// If the user has an existing anonymous account, we need to upgrade that.  Otherwise create a brand new account
		// Note that an upgraded user will have the same uid as their anonymous account, with any linked firestore data (but no firebase auth held personal data, since anon accounts don't store it)
		try {
			if (anonymousUser) {
				const credentials = EmailAuthProvider.credential(email, password)
				newOrUpgradedUser = await asyncUpgradeUser(credentials)
				if (!newOrUpgradedUser) {
					throw new Error('Unable to create user account.')
				}
			} else {
				// Create firebase customer
				const newUserCredentials = await createUserWithEmailAndPassword(auth, email, password)
				newOrUpgradedUser = newUserCredentials.user
			}
		} catch (error) {
			// TODO handling of 'auth/credential-already-in-use' is a bit rough here - it indicates a user (who has probably just placed an order) trying to upgrade an anonymous account to a full one, but they already have one.
			// This error will definitely be coming from the upgrade path (auth/email-already-in-use is the new user path).
			// As-is their just placed anonymous order is going to get lost in the void as far as their existing user account is concerned, unless they create a new account with a different email.
			// Would be nice to provide a method to transfer any order they may have just placed anonymously into their existing account, if they log in
			// Logic for this is probably better situated with the log in logic, but at time of writing we don't have anything there (would be a fairly large job to implement).
			// If it ever gets added, we could trigger the SignIn component to render in now if error === 'auth/credential-already-in-use'.
			setFormError(translateFirebaseError(error))
			return
		}

		try {
			await updateProfile(newOrUpgradedUser, { displayName: fullName })
		} catch (error) {
			// Not sure there's much else we can do - the basic account creation/upgrade has worked, we just can't set the name
			console.error('Error setting account name')
		}

		// Reporting success at this point since firebase account is created - if stripe account creation fails, the user still has an account that will work on our website.
		// So cannot assume that all users will have a stripe account linked to their firebase account.
		setMessage({ text: 'Account Created', type: MessageType.SUCCESS })

		// Now we need to see if the user already has a stripe account linked to their user account - very possible in the case of an upgraded anonymous user
		// Since they may well be creating an account just after checkout

		// Get a reference and snapshot to their users document
		const userDocRef = doc(firestore, 'users', newOrUpgradedUser.uid)
		const docSnap = await getDoc(userDocRef)

		// Will need to know this if we need to write to it
		let doesUserDocumentExist = docSnap.exists()

		// Stripe only gives us a single name field.  We will use business name for preference, with fullName as the fallback
		// Honestly not sure why we bother sending stripe a name - stripe ask them for a cardholders name no  matter what, and then overwrite what we send them
		let stripeCustomerName = fullName

		// If user has set a business name, we need to save this
		if (businessName) {
			stripeCustomerName = businessName
			try {
				if (doesUserDocumentExist) {
					await updateDoc(userDocRef, {
						businessName: businessName,
						updatedAt: serverTimestamp(),
					})
				} else {
					await setDoc(userDocRef, {
						businessName: businessName,
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
					})
					doesUserDocumentExist = true
				}
			} catch (error) {
				console.error('Error setting business name', error)
			}
		}

		// these are the state variables looking after the values in the sign up form - blank we've used everything we need for account creation
		setEmail('')
		setPassword('')
		setFullName('')
		setBusinessName('')

		// Do they have a stripe account?
		try {
			if (doesUserDocumentExist) {
				const data = docSnap.data()
				if (data?.stripeCustomerId?.length > 0) {
					// yes they do, we are done with this user
					return
				}
			}
		} catch (error) {
			// Given that we've just created or linked a user so firebase is working, getting here is probably a coding screw up somewhere close by.
			// Exit early since there isn't much we can do.  Technically non fatal since a stripe account can be created during checkout, though if firestore is really unavailable then there are bigger issues.
			console.error('Error retrieving data from users', error)
			return
		}

		// No linked stripe account - we need to create one

		try {
			// get a token for the api route
			const idToken = await newOrUpgradedUser.getIdToken()

			// Create stripe customer
			const response = await fetch('/api/create-stripe-customer', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${idToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: newOrUpgradedUser.email, name: stripeCustomerName }), // send the user's email and name
			})

			const { customerId } = await response.json()

			// After receiving Stripe customer ID, create a users document and add it there
			if (doesUserDocumentExist) {
				await updateDoc(userDocRef, {
					stripeCustomerId: customerId,
					updatedAt: serverTimestamp(),
				})
			} else {
				await setDoc(userDocRef, {
					stripeCustomerId: customerId,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				})
			}
		} catch (error) {
			// This is non-fatal, the firebase customer was created but a matching stripe customer could not be.  There is a checkout flow without an existing stripe customer, and later linking the one stripe creates at checkout up with the user (its used by anonymous checkout). So we'll let this logged in user go through that.
		}
	}

	const handleChange = (event) => {
		const { name, value } = event.currentTarget
		setFormError('')
		switch (name) {
			case 'username':
				setEmail(value)
				break
			case 'password':
				setPassword(value)
				break
			case 'fullName':
				setFullName(value)
				break
			case 'businessName':
				setBusinessName(value)
				break
		}
	}

	return (
		<div className={accountStyles.signInUpFormWrapper}>
			<h3>{title}</h3>
			{formError !== null && (
				<p className='onPageError' aria-live='polite'>
					{formError}
				</p>
			)}
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input
						type='email'
						name='username'
						value={email}
						onChange={handleChange}
						placeholder='E.g: email@example.com'
						autoComplete='email'
					/>
				</label>
				<label>
					Password:
					<input
						type='password'
						name='password'
						value={password}
						onChange={handleChange}
						placeholder='Choose a Password'
						autoComplete='new-password'
					/>
				</label>
				<label>
					Your Name:
					<input
						type='text'
						name='fullName'
						value={fullName}
						onChange={handleChange}
						placeholder='E.g: John Smith'
						autoComplete='fullname'
					/>
				</label>
				<label>
					Business Name:
					<input
						type='text'
						name='businessName'
						value={businessName}
						onChange={handleChange}
						placeholder='(Optional)'
						autoComplete='organization'
					/>
				</label>
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	)
}

export default SignUp
