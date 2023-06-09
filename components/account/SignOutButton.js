import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '/utils/firebaseClient'
import { translateFirebaseError } from '/utils/firebaseClient'
import { FlashMessageContext, MessageType } from '/components/contexts/FlashMessageContext'

const SignOutButton = () => {
	const { setMessage } = useContext(FlashMessageContext)
	const handleLogout = async () => {
		try {
			await signOut(auth)
		} catch (error) {
			setMessage({ text: translateFirebaseError(error), type: MessageType.ERROR })
		}
	}

	return <button onClick={handleLogout}>Log Out</button>
}

export default SignOutButton
