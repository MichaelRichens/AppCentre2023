import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'
import accountStyles from '../styles/Account.shared.module.css'

function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const signIn = async (event) => {
		event.preventDefault()
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			console.log(userCredential)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className={accountStyles.signInWrapper}>
			<form className={accountStyles.signIn} onSubmit={signIn}>
				<input type='email' onChange={(e) => setEmail(e.target.value)} />
				<input type='password' onChange={(e) => setPassword(e.target.value)} />
				<button type='submit'>Sign In</button>
			</form>
		</div>
	)
}

export default SignIn
