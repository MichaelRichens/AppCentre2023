import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { LineWave } from 'react-loader-spinner'
import { auth } from '../../utils/firebaseClient'

const withAuth = (Component) => {
	return (props) => {
		const router = useRouter()
		const [loading, setLoading] = useState(true)

		useEffect(() => {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				if (!user) {
					sessionStorage.setItem('targetPage', router.pathname)
					router.push('/login')
				}
				setLoading(false)
			})

			// Cleanup subscription on unmount
			return () => unsubscribe()
		}, [])

		// Render a loading indicator while waiting for hydration to check auth status
		if (loading) {
			return (
				<div style={{ textAlign: 'center' }}>
					<LineWave width='400' height='400' color='#4fa94d' ariaLabel='Authenticating' />
				</div>
			)
		}

		// Render the component only if the user is authenticated
		return <Component {...props} />
	}
}

export default withAuth
