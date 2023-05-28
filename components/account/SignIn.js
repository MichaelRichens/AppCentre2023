import React, { useState, useContext } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth, translateFirebaseError } from '../../utils/firebaseClient'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'
import accountStyles from '../../styles/Account.shared.module.css'

function SignIn({ title }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [formError, setFormError] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	const signIn = async (event) => {
		event.preventDefault()
		setFormError(null) // Clear out any previous errors
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			setMessage({ text: 'Logged In Successfully', type: MessageType.SUCCESS })
		} catch (error) {
			setFormError(translateFirebaseError(error))
		}
	}

	const resetPassword = async () => {
		setFormError(null) // Clear out any previous errors
		try {
			await sendPasswordResetEmail(auth, email)
			setMessage({ text: 'Password reset email sent.', type: MessageType.INFO })
		} catch (error) {
			setFormError(translateFirebaseError(error))
		}
	}

	return (
		<div className={accountStyles.signInUpFormWrapper}>
			<h3>{title}</h3>
			<form onSubmit={signIn}>
				<label>
					Email:
					<input
						type='email'
						name='username'
						placeholder='E.g: email@example.com'
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<label>
					Password:
					<input
						type='password'
						name='password'
						placeholder='Your Password'
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<button type='submit'>Sign In</button>
				<button type='button' onClick={resetPassword}>
					Reset Password
				</button>
			</form>
			{formError && (
				<p className='onPageError' aria-live='polite'>
					{formError}
				</p>
			)}
		</div>
	)
}

export default SignIn
