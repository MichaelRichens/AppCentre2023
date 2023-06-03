import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
	confirmPasswordReset,
	verifyPasswordResetCode,
	signInWithEmailAndPassword,
	checkActionCode,
	applyActionCode,
} from 'firebase/auth'
import Page from '../components/page/Page'
import { FlashMessageContext, MessageType } from '../components/contexts/FlashMessageContext'
import { auth, translateFirebaseError } from '../utils/firebaseClient'
import accountStyles from '../styles/Account.shared.module.css'

const AuthAction = () => {
	const [oobState, setOobState] = useState(null)
	const [modeState, setModeState] = useState(null)
	const [continueUrlState, setContinueUrlState] = useState(null)
	const [actionCodeInfoState, setActionCodeInfoState] = useState(null)
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const [email, setEmail] = useState(null)
	const [error, setError] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	const router = useRouter()

	// Process url parameters on first page load
	useEffect(() => {
		// Get the action code from the URL, and put them into state variables
		const urlParams = new URLSearchParams(window.location.search)
		const oob = urlParams.get('oobCode')
		const mode = urlParams.get('mode')
		const continueUrl = urlParams.get('continueUrl')
		setOobState(oob)
		setModeState(mode)
		// continue url may not be set - isn't relevant for recoverEmail mode, and we have to pass it for it to happen at all
		setContinueUrlState(continueUrl)

		switch (mode) {
			// User has requested a new password, and been sent an email with a link here to set one
			case 'resetPassword': {
				// Verify the password reset code and get the email
				const fetchEmail = async () => {
					try {
						const email = await verifyPasswordResetCode(auth, oob)
						setEmail(email) // The code is valid and the user's email is returned
						return
					} catch (error) {
						setError(translateFirebaseError(error)) // The code is invalid, expired, or doesn't correspond to a password reset request
						return
					}
				}

				fetchEmail()
				break
			}
			// User's email address was changed, they were sent an email to their old address informing them and telling them to click the link to come here if they didn't authorise it
			case 'recoverEmail': {
				const recoverEmail = async () => {
					try {
						const actionCodeInfo = await checkActionCode(auth, oob)
						setActionCodeInfoState(actionCodeInfo)
						console.log(actionCodeInfo)
						await applyActionCode(auth, oob)
					} catch (error) {
						console.log(error)
						if (error.code === 'auth/email-already-in-use') {
							// This is a problem - the original account email has another account associated with it.  Given we don't verify emails on account creation or email address change, this is something that technically could happen.
							// Someone gets access to an account, changes the email, then creates another account with the first email to prevent reversion.
							// Can't image *why* anyone would want to do it to an account on our website...
							// The best resolution would be to enable email verification on account creation, but don't want to since it seems overkill to inconvenience every customer over something like this.
							// Second best would be to disable this account at this point.  But that would need to be done server side, which would require creating an api route which has the capability to disable an account.
							// Securing it would be an issue, given this user isn't logged in by definition.  Seems like it might lead to serious problems if it got exploited.
							// So just going to leave it as something to deal with if it ever happens.
							setError('EMAIL IN USE')
						} else {
							// some other error from firebase - just display to user
							setError(translateFirebaseError(error))
						}
					}
				}

				recoverEmail()
				break
			}
			default: {
				// We do not use email verification, so there is no handling for verifyEmail here.
				console.error(`Unknown mode query string at page auth-action:`, mode)
			}
		}
	}, [])

	// Handle password reset
	const handleSubmitPWReset = async (e) => {
		e.preventDefault()
		if (newPassword !== confirmNewPassword) {
			setError('Passwords do not match')
			return
		}

		try {
			await confirmPasswordReset(auth, oobState, newPassword)
			await signInWithEmailAndPassword(auth, email, newPassword)
			setMessage({ text: 'Password changed successfully!', type: MessageType.SUCCESS })
			if (continueUrlState) {
				router.push(continueUrlState)
			} else {
				router.push('/account')
			}
			return
		} catch (error) {
			setError(error)
			return
		}
	}

	switch (modeState) {
		// User has requested a new password, and been sent an email with a link here to set one
		case 'resetPassword': {
			return (
				<Page title='Password reset'>
					<div className={accountStyles.signInUpFormWrapper}>
						{error && <p className='onPageError'>{error}</p>}
						<form onSubmit={handleSubmitPWReset}>
							<input
								type='email'
								value={email ? email : ''}
								autoComplete='username'
								readOnly
								style={{ display: 'none' }}
							/>
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
		case 'recoverEmail': {
			return (
				<Page title='Revert Email Change' mainClassName={accountStyles.accountDetailsPage}>
					<section>
						{!error ? (
							<p>Email address has been reverted to {actionCodeInfoState?.data?.email}</p>
						) : error === 'EMAIL IN USE' ? (
							<>
								<p>
									Unable to revert email to {actionCodeInfoState?.data?.email}. Another account with this email address
									already exists.
								</p>
								<p>
									Please <Link href='/contact'>contact us</Link> for assistance.
								</p>
							</>
						) : (
							<>
								<p>An error has occurred: {error}</p>
								<p>
									Please <Link href='/contact'>contact us</Link> for assistance.
								</p>
							</>
						)}
					</section>
				</Page>
			)
		}
		default:
			return (
				<Page title='Error: Unable to Process'>
					<p>
						Very sorry, please <Link href='/contact'>contact us</Link> for assistance.
					</p>
				</Page>
			)
	}
}

export default AuthAction
