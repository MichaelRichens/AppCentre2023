import { signOut } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'

const SignOutButton = () => {
	const handleLogout = async () => {
		try {
			await signOut(auth)
		} catch (error) {
			console.error('Error signing out', error)
		}
	}

	return <button onClick={handleLogout}>Log Out</button>
}

export default SignOutButton
