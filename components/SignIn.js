import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../utils/firebaseClient'

function SignIn() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const signIn = async (event) => {
		event.preventDefault()
		try {
			await signInWithEmailAndPassword(auth, email, password)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<h2>Log In</h2>
			<form onSubmit={signIn}>
				<input type='email' onChange={(e) => setEmail(e.target.value)} />
				<input type='password' onChange={(e) => setPassword(e.target.value)} />
				<button type='submit'>Sign In</button>
			</form>
		</>
	)
}

export default SignIn
