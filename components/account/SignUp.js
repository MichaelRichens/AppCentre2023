import React, { useState } from 'react'
import { auth } from '../../utils/firebaseClient'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import accountStyles from '../../styles/Account.shared.module.css'

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

		if (name === 'username') {
			setEmail(value)
		} else if (name === 'password') {
			setPassword(value)
		}
	}

	return (
		<div className={accountStyles.signInUpFormWrapper}>
			{error !== null && <p className='formError'>{error}</p>}
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
