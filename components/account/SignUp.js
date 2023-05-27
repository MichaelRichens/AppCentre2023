import React, { useState } from 'react'
import { auth } from '../../utils/firebaseClient'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import accountStyles from '../styles/Account.shared.module.css'

function SignUp() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			await createUserWithEmailAndPassword(auth, email, password)
			setEmail('')
			setPassword('')
		} catch (error) {
			console.error(error)
			setError('Error signing up with email and password')
		}
	}

	const handleChange = (event) => {
		const { name, value } = event.currentTarget

		if (name === 'userEmail') {
			setEmail(value)
		} else if (name === 'userPassword') {
			setPassword(value)
		}
	}

	return (
		<div className={accountStyles.signInWrapper}>
			{error !== null && <div>{error}</div>}
			<form className={accountStyles.signIn} onSubmit={handleSubmit}>
				<label htmlFor='userEmail'>Email:</label>
				<input
					type='email'
					name='userEmail'
					value={email}
					onChange={handleChange}
					placeholder='E.g: faruq123@gmail.com'
				/>
				<label htmlFor='userPassword'>Password:</label>
				<input
					type='password'
					name='userPassword'
					value={password}
					onChange={handleChange}
					placeholder='Your Password'
				/>
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	)
}

export default SignUp
