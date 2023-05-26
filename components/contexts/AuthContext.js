import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../utils/firebaseClient'

const AuthContext = createContext({ user: null, isAuthLoading: true })

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [isAuthLoading, setIsAuthLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user)
			setIsAuthLoading(false)
		})

		return () => unsubscribe()
	}, [])

	return <AuthContext.Provider value={{ user, isAuthLoading }}>{children}</AuthContext.Provider>
}
