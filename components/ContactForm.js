import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from './contexts/AuthContext'
import { auth, firestore } from '../utils/firebaseClient'
import { signInAnonymously } from 'firebase/auth'
import { FlashMessageContext, MessageType } from './contexts/FlashMessageContext'

import styles from '../styles/ContactForm.module.css'

function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

/**
 * @component
 * Provides a contact form for users to email us.
 * @returns {JSX.Element} The rendered  component.
 */
const ContactForm = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [emailBody, setEmailBody] = useState('')
	const [business, setBusiness] = useState('')
	const [error, setError] = useState(null)

	const { user, anonymousUser, isAuthLoading } = useAuth()
	const { setMessage } = useContext(FlashMessageContext)

	const debouncedEmail = useDebounce(email, 500)

	// Populate the form if the user is logged in - checking name and email aren't filled just in case this gets triggered late by a slow auth load or something
	// - don't want to wipe out anything the user has started typing
	useEffect(() => {
		if (!isAuthLoading && user && name === '' && email === '') {
			setName(user?.displayName || '')
			setEmail(user?.email || '')
		}
	}, [isAuthLoading, user])

	useEffect(() => {
		const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
		if (debouncedEmail && !emailPattern.test(debouncedEmail)) {
			setError('Please enter a valid email address')
		} else {
			setError(null)
		}
	}, [debouncedEmail])

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (emailBody?.length < 10) {
			setError('Message too short.')
		}

		if (error) return

		// Our api route requires a firebase token, so create an anonymous firebase account for the user if they are not signed in with us already

		if (isAuthLoading) return // button should be disabled, but check just to be sure

		let actualUser = user || anonymousUser

		if (!actualUser) {
			const userCredential = await signInAnonymously(auth)

			actualUser = userCredential.user
		}

		// Get the token
		const idToken = await actualUser.getIdToken()

		const data = { name, email, emailBody, business }

		const response = await fetch('/api/contact', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})

		if (response.ok) {
			setMessage({ text: 'Email Sent', type: MessageType.SUCCESS })
			setEmailBody('')
		} else {
			setMessage({ text: 'Email Failed to Send', type: MessageType.ERROR })
		}
	}

	const handleChange = (event) => {
		const { name, value } = event.target
		switch (name) {
			case 'name':
				setName(value)
				break
			case 'email':
				setError(null)
				setEmail(value)
				break
			case 'emailBody':
				setEmailBody(value)
				break
			case 'business':
				setBusiness(value)
				break
		}
	}

	// the business field is a honeypot for bots - if anything is filled into it, the form will be rejected by our api route
	return (
		<div>
			<form className={styles.contactForm} onSubmit={handleSubmit}>
				<input type='text' name='business' onChange={handleChange} style={{ display: 'none' }} />
				<input
					type='text'
					name='name'
					autoComplete='fullname'
					placeholder='Your name'
					aria-label='Your full name'
					value={name}
					onChange={handleChange}
				/>
				<input
					type='email'
					name='email'
					autoComplete='email'
					placeholder='Your email'
					aria-label='Your email address'
					required
					value={email}
					onChange={handleChange}
				/>
				<textarea
					name='emailBody'
					placeholder='Your message'
					aria-label='Your message to us'
					required
					value={emailBody}
					onChange={handleChange}></textarea>

				<button type='submit' disabled={isAuthLoading}>
					Send Email
				</button>
				{error && <p className='onPageError'>{error}</p>}
			</form>
		</div>
	)
}

export default ContactForm
