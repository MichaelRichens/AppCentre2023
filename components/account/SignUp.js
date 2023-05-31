import React, { useState, useContext } from 'react'
import { auth, firestore, translateFirebaseError } from '../../utils/firebaseClient'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'
import accountStyles from '../../styles/Account.shared.module.css'

function SignUp({ title }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [formError, setFormError] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	const handleSubmit = async (event) => {
		event.preventDefault()

		let firebaseAccountCreatedOk = false
		let newUser

		try {
			// Create firebase customer
			const newUserCredentials = await createUserWithEmailAndPassword(auth, email, password)
			newUser = newUserCredentials.user
			firebaseAccountCreatedOk = true

			// For the moment, reporting success at this point since firebase account is created - if stripe account creation fails, the user still has an account that will work on our website.
			// So cannot assume that all users will have a stripe account linked to their firebase account.
			setMessage({ text: 'Account Created', type: MessageType.SUCCESS })

			// these are the state variables looking after the values in the sign up form - blank them after account creation
			setEmail('')
			setPassword('')
		} catch (error) {
			setFormError(translateFirebaseError(error))
		}

		if (firebaseAccountCreatedOk) {
			try {
				// get a token for the api route
				const idToken = await newUser.getIdToken()

				// Create stripe customer
				const response = await fetch('/api/create-stripe-customer', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${idToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email: newUser.email }), // send the user's email
				})

				const { customerId } = await response.json()

				// After receiving Stripe customer ID, create a users document and add it there
				const userDocRef = doc(firestore, 'users', auth.currentUser.uid)
				await setDoc(userDocRef, {
					stripeCustomerId: customerId,
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				})
			} catch (error) {
				console.error('Error creating customer with Stripe', error)
				// This is non-fatal, the firebase customer was created but a matching stripe customer could not be.  There is a checkout flow without an existing stripe customer, and linking the one stripe creates at checkout up with the user (used by anonymous checkout). So we'll let this logged in user go through that.
			}
		}
	}

	const handleChange = (event) => {
		const { name, value } = event.currentTarget

		if (name === 'username') {
			setEmail(value)
		} else if (name === 'password') {
			setPassword(value)
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
					/>
				</label>
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	)
}

export default SignUp
