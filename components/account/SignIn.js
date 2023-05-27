import React, { useState, useContext } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'
import MessageType from '../../utils/types/enums/MessageType'
import { FlashMessageContext } from '../contexts/FlashMessageContext'
import accountStyles from '../../styles/Account.shared.module.css'

function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [formError, setFormError] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	const signIn = async (event) => {
		event.preventDefault()
		setFormError(null) // Clear out any previous errors
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
		} catch (error) {
			setFormError(error.message)
		}
	}

	const resetPassword = async () => {
		setFormError(null) // Clear out any previous errors
		try {
			await sendPasswordResetEmail(auth, email)
			setMessage({ text: 'Password reset email sent.', type: MessageType.INFO })
		} catch (error) {
			setFormError(error.message)
		}
	}

	return (
		<div className={accountStyles.signInUpFormWrapper}>
			<h2>Log In or Reset Password:</h2>
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
				<button type='button' onClick={resetPassword}>
					Reset Password
				</button>
			</form>
			{formError && <p className='formError'>{formError}</p>}
		</div>
	)
}

export default SignIn
