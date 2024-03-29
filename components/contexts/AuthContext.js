import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, linkWithCredential, updateProfile } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'

const AuthContext = createContext({ user: null, anonymousUser: null, isAuthLoading: true, upgradeUser: null })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [anonymousUser, setAnonymousUser] = useState(null)
	const [isAuthLoading, setIsAuthLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				if (firebaseUser.isAnonymous) {
					setAnonymousUser(firebaseUser)
					setUser(null)
				} else {
					setUser(firebaseUser)
					setAnonymousUser(null)
				}
			} else {
				setUser(null)
				setAnonymousUser(null)
			}
			setIsAuthLoading(false)
		})

		return () => unsubscribe()
	}, [])

	/**
	 *  Upgrades the current anonymousUser to full user with the passed credentials and returns upgraded user on success, or false upon failure
	 *  Handles updating user/anonymousUser state variables (onAuthStateChanged listener that is set up ignores this, so has to be done manually)
	 */
	const asyncUpgradeUser = async (credential) => {
		if (anonymousUser) {
			const userCredential = await linkWithCredential(anonymousUser, credential)
			const upgradedUser = userCredential.user
			if (upgradedUser) {
				setUser(upgradedUser)
				setAnonymousUser(null)
				return upgradedUser
			}
		}
		return false
	}

	return (
		<AuthContext.Provider value={{ user, anonymousUser, isAuthLoading, asyncUpgradeUser }}>
			{children}
		</AuthContext.Provider>
	)
}
