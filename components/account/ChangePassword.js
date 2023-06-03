import React, { useState, useContext } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { translateFirebaseError } from '../../utils/firebaseClient'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'

import accountStyles from '../../styles/Account.shared.module.css'

/**
 * `ChangePassword` is a component for changing the password of a currently logged in user.
 * @warning It should only be called with a logged in user (it checks for this an will return a null component if not)
 *
 * This component provides form fields for entering the current password and the new password.
 * It validates input, handles form submission, and updates the password in Firebase.
 * It also handles potential errors during password update and displays corresponding flash messages.
 *
 * @component
 * @param {object} props - Properties passed to the component.
 * @param {function} props.onExit - Function to be called when the change password process is completed or cancelled.
 *
 * @example
 * // In a parent component, use it like this:
 * <ChangePassword onExit={handleExit} />
 *
 * // And define handleExit like this:
 * function handleExit() {
 *   // ...code to run on exit... (probably just set component not to be displayed)
 * }
 *
 * @returns {JSX.Element} The rendered React component.
 */
const ChangePassword = ({ onExit }) => {
	const { user } = useAuth()
	const { setMessage } = useContext(FlashMessageContext)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (!newPassword || newPassword?.length < 6) {
			setMessage({ text: 'New password should be at least 6 characters', type: MessageType.ERROR })
			return
		}

		try {
			const credential = EmailAuthProvider.credential(user.email, currentPassword)
			await reauthenticateWithCredential(user, credential)
			await updatePassword(user, newPassword)

			// If it hasn't thrown by this point, then the password change has been made
			setCurrentPassword('')
			setNewPassword('')
			setMessage({ text: 'Password Changed', type: MessageType.SUCCESS })
			onExit()
		} catch (error) {
			setMessage({ text: translateFirebaseError(error), type: MessageType.ERROR })
		}
	}

	if (!user) {
		return null
	} else {
		return (
			<div className={accountStyles.signInUpFormWrapper}>
				<form onSubmit={handleSubmit}>
					<label>
						Current Password:
						<input
							type='password'
							name='currentPassword'
							placeholder='Current Password'
							onChange={(e) => setCurrentPassword(e.target.value)}
							autoComplete='current-password'
						/>
					</label>
					<label>
						New Password:
						<input
							type='password'
							name='newPassword'
							placeholder='New Password - 6 characters or more'
							onChange={(e) => setNewPassword(e.target.value)}
							autoComplete='new-password'
						/>
					</label>
					<button type='submit' disabled={!newPassword || newPassword?.length < 6}>
						Submit
					</button>
					<button type='button' onClick={onExit}>
						Cancel
					</button>
				</form>
			</div>
		)
	}
}

export default ChangePassword
