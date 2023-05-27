import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { confirmPasswordReset, verifyPasswordResetCode, signInWithEmailAndPassword } from 'firebase/auth'
import Page from '../components/page/Page'
import { auth } from '../utils/firebaseClient'
import accountStyles from '../styles/Account.shared.module.css'

const AuthAction = () => {
	const [oobCode, setOobCode] = useState(null)
	const [mode, setMode] = useState(null)
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const [email, setEmail] = useState(null)
	const [error, setError] = useState(null)

	const router = useRouter()

	// Get the action code from the URL
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const oob = urlParams.get('oobCode')
		const mode = urlParams.get('mode')
		setOobCode(oob)
		setMode(mode)

		// Verify the password reset code and get the email
		if (mode === 'resetPassword') {
			const fetchEmail = async () => {
				try {
					const email = await verifyPasswordResetCode(auth, oob)
					setEmail(email) // The code is valid and the user's email is returned
				} catch (error) {
					setError(error) // The code is invalid, expired, or doesn't correspond to a password reset request
				}
			}

			fetchEmail()
		}
	}, [])

	// Handle password reset
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (newPassword !== confirmNewPassword) {
			setError('Passwords do not match')
			return
		}

		try {
			await confirmPasswordReset(auth, oobCode, newPassword)
			await signInWithEmailAndPassword(auth, email, newPassword)
			router.push('/account')
		} catch (error) {
			setError(error.message)
		}
	}
	switch (mode) {
		case 'resetPassword': {
			return (
				<Page title='Password reset'>
					<div className={accountStyles.signInUpFormWrapper}>
						{error && <p className='formError'>{error}</p>}
						<form onSubmit={handleSubmit}>
							<input type='email' value={email} autoComplete='username' readOnly style={{ display: 'none' }} />
							<input
								type='password'
								placeholder='New password'
								onChange={(e) => setNewPassword(e.target.value)}
								autoComplete='new-password'
							/>
							<input
								type='password'
								placeholder='Confirm new password'
								onChange={(e) => setConfirmNewPassword(e.target.value)}
								autoComplete='new-password'
							/>
							<button type='submit'>Submit</button>
						</form>
					</div>
				</Page>
			)
		}
		default:
			console.error(`Unknown mode:`, mode)
	}
}

export default AuthAction
