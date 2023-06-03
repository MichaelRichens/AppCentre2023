import React, { useState, useEffect, useContext } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { translateFirebaseError } from '../../utils/firebaseClient'
import { FlashMessageContext, MessageType } from '../contexts/FlashMessageContext'

import accountStyles from '../../styles/Account.shared.module.css'

const ChangePassword = ({ onExit }) => {
	const { user } = useAuth()
	const { setMessage } = useContext(FlashMessageContext)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (!newPassword || newPassword.length < 6) {
			setMessage({ text: 'New password should be at least 6 characters', type: MessageType.ERROR })
			return
		}

		try {
			const credential = EmailAuthProvider.credential(user.email, currentPassword)
			await reauthenticateWithCredential(user, credential)
			await updatePassword(user, newPassword)
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
							autoComplete='current-password'
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
