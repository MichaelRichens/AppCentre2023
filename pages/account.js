import React, { useState, useEffect } from 'react'
import Page from '../components/page/Page'
import withAuth from '../components/hoc/withAuth'
import { useAuth } from '../components/contexts/AuthContext'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import { firestore } from '../utils/firebaseClient'
import { doc, onSnapshot, collection, where, query } from 'firebase/firestore'
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

		const orderDocRef = query(collection(firestore, 'orders'), where('firebaseUserId', '==', user.uid))

		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			const data = []
			querySnapshot.forEach((doc) => {
				if (doc.exists) {
					const order = doc.data()

					if (order.line_items) {
						for (const key in order.line_items) {
							order.line_items[key] = ProductConfiguration.fromRawProperties(order.line_items[key])
						}
					}

					data.push(order)
				}
			})

			setOrders(data)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeUsers()
			unsubscribeOrders()
		}
	}, [user])

	return (
		<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
			<section>
				<h2>Details</h2>
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
			<section>
				<h2>Orders</h2>
				{orders?.length ? (
					<ul>
						{orders.map((order) => (
							<li key={order.sessionId}>{order.status}</li>
						))}
					</ul>
				) : (
					<p>No orders yet!</p>
				)}
			</section>
		</Page>
	)
}

export default withAuth(Account)
