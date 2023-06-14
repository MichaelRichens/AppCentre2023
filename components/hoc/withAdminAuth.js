import React, { useEffect, useState } from 'react'
import { firestore } from '/utils/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'
import Page from '../page/Page'
import SignIn from '../account/SignIn'
import { useAuth } from '../contexts/AuthContext'
import LoadingPage from '../page/LoadingPage'

/**
 * This HOC checks that the user is logged into an account which has the admin role, and only serves the wrapped component if this is the case, otherwise showing a log in or access denied page.
 * This is subject to client side manipulation, so should not be relied on for security.  Any sensitive data or abilities must be further secured.
 * - client side they must be accessed from a firestore document that requires the accessing user have the admin role in its access rules
 * - server side they must be behind an api route which requires a firebase authentication token generated by an admin user
 */
const withAdminAuth = (Component) => {
	return (props) => {
		const { user, isAuthLoading } = useAuth()

		const [userIsAdmin, setUserIsAdmin] = useState(null)

		useEffect(() => {
			if (isAuthLoading) {
				return
			}

			const checkAdminRole = async () => {
				try {
					const userDocRef = doc(firestore, 'users', user.uid)
					const docSnap = await getDoc(userDocRef)
					if (docSnap.exists()) {
						const userData = docSnap.data()
						if (userData.role === 'admin') {
							setUserIsAdmin(true)
						} else {
							setUserIsAdmin(true)
						}
					}
				} catch (error) {
					setUserIsAdmin(false)
				}
			}

			if (user) {
				checkAdminRole()
				return
			} else {
				setUserIsAdmin(false)
			}
		}, [user, isAuthLoading])

		// userIsAdmin starts as null, and will be set to true or false once the checks on the existence of a logged in user, and their privileges, have been completed
		if (userIsAdmin === null) {
			return <LoadingPage />
		}

		// The user is not logged in
		if (!user) {
			return (
				<Page title='Admin log in'>
					<SignIn />
				</Page>
			)
		}

		// The user is logged into an account that does not have the admin role
		if (!userIsAdmin) {
			return (
				<Page title='Access Denied'>
					<section className='text'>
						<p>You do not have permission to view this page.</p>
					</section>
				</Page>
			)
		}

		// Only allow the requested page for admin users
		return <Component {...props} />
	}
}

export default withAdminAuth
