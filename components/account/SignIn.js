import React, { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'
import accountStyles from '../../styles/Account.shared.module.css'

function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [resetEmail, setResetEmail] = useState('')
	const [resetEmailError, setResetEmailError] = useState(null)

	const signIn = async (event) => {
		event.preventDefault()
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			console.log(userCredential)
		} catch (error) {
			console.error(error)
		}
	}

	const resetPassword = async (event) => {
		event.preventDefault()
		setResetEmailError(null) // Clear out any previous errors

		try {
			await sendPasswordResetEmail(auth, resetEmail)
			alert('Password reset email sent!')
		} catch (error) {
			setResetEmailError(error.message)
		}
	}

	return (
		<div className={accountStyles.signInUpFormWrapper}>
			<form onSubmit={signIn}>
				<label>
					Email:
					<input type='email' onChange={(e) => setEmail(e.target.value)} />
				</label>
				<label>
					Password:
					<input type='password' onChange={(e) => setPassword(e.target.value)} />
				</label>
				<button type='submit'>Sign In</button>
			</form>
			<form onSubmit={resetPassword}>
				<label>
					Reset Password:
					<input type='email' onChange={(e) => setResetEmail(e.target.value)} placeholder='Enter your email' />
				</label>
				<button type='submit'>Reset Password</button>
				{resetEmailError && <p className='formError'>{resetEmailError}</p>}
			</form>
		</div>
	)
}

export default SignIn
