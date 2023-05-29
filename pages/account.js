import React, { useState, useEffect } from 'react'
import Page from '../components/page/Page'
import withAuth from '../components/hoc/withAuth'
import { useAuth } from '../components/contexts/AuthContext'
import { firestore } from '../utils/firebaseClient'
import { doc, getDoc } from 'firebase/firestore'
import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()
	const [userDetails, setUserDetails] = useState({})

	useEffect(() => {
		const lookup = async () => {
			const userDocRef = doc(firestore, 'users', user.uid)
			const docSnap = await getDoc(userDocRef)
			if (docSnap.exists()) {
				const data = docSnap.data()
				setUserDetails(data)
			}
		}
		lookup()
	}, [])

	return (
		<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
			<section>
				<ul>
					<li>
						<strong>Your Email:</strong> {user.email || 'Not Set'}
					</li>
					<li>
						<strong>Firebase User ID:</strong> {user.uid || 'Not Set'}
					</li>
					<li>
						<strong>Stripe Customer ID:</strong> {userDetails.stripeCustomerId || 'Not Set'}
					</li>
				</ul>
			</section>
		</Page>
	)
}

export default withAuth(Account)
