import React, { useState, useEffect } from 'react'
import Page from '../components/page/Page'
import withAuth from '../components/hoc/withAuth'
import { useAuth } from '../components/contexts/AuthContext'
import CustomerOrders from '../components/account/CustomerOrders'
import { firestore } from '../utils/firebaseClient'
import { doc, onSnapshot } from 'firebase/firestore'
import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()
	const [userDetails, setUserDetails] = useState({})
	const [orders, setOrders] = useState([])

	useEffect(() => {
		const userDocRef = doc(firestore, 'users', user.uid)

		const unsubscribeUsers = onSnapshot(userDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data()
				setUserDetails(data)
			}
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeUsers()
		}
	}, [user])

	return (
		<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
			<section>
				<h2>Details</h2>
				<ul>
					<li>
						<strong>Your Name:</strong> {user.displayName || 'Not Set'}
					</li>
					<li>
						<strong>Your Email:</strong> {user.email || 'Not Set'}
					</li>
					<li>
						<strong>Company Name:</strong> {userDetails.businessName || 'Not Set'}
					</li>
					<li>
						<strong>Firebase User ID:</strong> {user.uid || 'Not Set'}
					</li>
					<li>
						<strong>Stripe Customer ID:</strong> {userDetails.stripeCustomerId || 'Not Set'}
					</li>
				</ul>
			</section>
			<section>
				<h2>Orders</h2>
				<CustomerOrders user={user} />
			</section>
		</Page>
	)
}

export default withAuth(Account)
