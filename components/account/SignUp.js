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

		if (name === 'userEmail') {
			setEmail(value)
		} else if (name === 'userPassword') {
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
						name='userEmail'
						value={email}
						onChange={handleChange}
						placeholder='E.g: it@company.co.uk'
					/>
				</label>
				<label>
					Password:
					<input
						type='password'
						name='userPassword'
						value={password}
						onChange={handleChange}
						placeholder='Your Password'
					/>
				</label>
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	)
}

export default SignUp
