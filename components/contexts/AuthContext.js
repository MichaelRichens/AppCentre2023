import { createContext, useContext, useEffect, useState } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'

const AuthContext = createContext({ user: null, anonymousUser: null, isAuthLoading: true })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [anonymousUser, setAnonymousUser] = useState(null)
	const [isAuthLoading, setIsAuthLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
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

	return <AuthContext.Provider value={{ user, anonymousUser, isAuthLoading }}>{children}</AuthContext.Provider>
}
