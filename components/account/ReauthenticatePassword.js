import React, { useState, useEffect, useContext } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { translateFirebaseError } from '../../utils/firebaseClient'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'

import accountStyles from '../../styles/Account.shared.module.css'

/**
 * `ReauthenticatePassword` is a component that prompts the user to re-authenticate by entering their password.
 *
 * It is generally used when a sensitive operation is performed that requires the user to have recently signed in.
 *
 * The component receives two props: `onSuccess` and `onCancel`.
 *
 * `onSuccess` is a function that is called when the user successfully re-authenticates.
 * `onCancel` is a function that is called when the re-authentication process is cancelled, either by the user action or if there's no authenticated user.
 *
 * @component
 * @example
 * // Example usage of ReauthenticatePassword
 * <ReauthenticatePassword
 *     onSuccess={() => console.log("User reauthenticated successfully")}
 *     onCancel={() => console.log("Reauthentication cancelled")}
 * />
 *
 * @param {Object} props The props for the component.
 * @param {Function} props.onSuccess The function to call when re-authentication is successful.
 * @param {Function} props.onCancel The function to call when re-authentication is cancelled.
 *
 * @returns {JSX.Element} A form that allows the user to reauthenticate by entering their password.
 */
const ReauthenticatePassword = ({ onSuccess, onCancel }) => {
	const { user } = useAuth()
	const { setMessage } = useContext(FlashMessageContext)

	const [password, setPassword] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		try {
			const credential = EmailAuthProvider.credential(user.email, password)
			await reauthenticateWithCredential(user, credential)
			onSuccess()
		} catch (error) {
			setMessage({ text: translateFirebaseError(error), type: MessageType.ERROR })
		}
	}

	useEffect(() => {
		if (!user) onCancel()
	}, [user])

	if (!user) {
		return null
	} else {
		return (
			<div className={accountStyles.signInUpFormWrapper}>
				<form onSubmit={handleSubmit}>
					<label>
						Password:
						<input
							type='password'
							name='password'
							placeholder='Your Password'
							onChange={(e) => setPassword(e.target.value)}
							autoComplete='current-password'
						/>
					</label>
					<button type='submit'>Submit</button>
					<button type='button' onClick={onCancel}>
						Cancel
					</button>
				</form>
			</div>
		)
	}
}

export default ReauthenticatePassword
