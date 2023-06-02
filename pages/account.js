import React, { useState, useEffect, useContext } from 'react'
import { setTimeout } from 'timers'
import Page from '../components/page/Page'
import withAuth from '../components/hoc/withAuth'
import { updateProfile, updateEmail } from 'firebase/auth'
import { useAuth } from '../components/contexts/AuthContext'
import { FlashMessageContext, MessageType } from '../components/contexts/FlashMessageContext'
import CustomerOrders from '../components/account/CustomerOrders'
import { firestore } from '../utils/firebaseClient'
import { translateFirebaseError } from '../utils/firebaseClient'
import { doc, onSnapshot } from 'firebase/firestore'
import EditableField from '../components/EditableField'

import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()
	const [userDetails, setUserDetails] = useState({})
	const [updateCount, setUpdateCount] = useState(0)
	const { setMessage } = useContext(FlashMessageContext)

	// Empty useEffect to trigger rerender when updateCount change lets us know about a change to the user profile.
	useEffect(() => {}, [updateCount])

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

	const handleDisplayNameChange = async (value) => {
		try {
			await updateProfile(user, { displayName: value })
			setTimeout(async () => {
				if (user?.displayName === value || (!user?.displayName && !value)) {
					setUpdateCount((count) => count + 1) // increment the updateCount to trigger re-render
				}
			}, 500)
		} catch (error) {
			setMessage({
				text: translateFirebaseError(error),
				type: MessageType.ERROR,
			})
		}
	}

	const handleEmailChange = async (value) => {
		try {
			await updateEmail(user, value)
		} catch (error) {
			if (error?.code !== 'auth/requires-recent-login') {
				setMessage({
					text: translateFirebaseError(error),
					type: MessageType.ERROR,
				})
				return
			}
			// TODO proper reauthorisation here, just telling the user to do this is pretty ugly
			setMessage({
				text: 'Sorry, you must log out and log back to your account to change your email address.',
				type: MessageType.ERROR,
			})
			return
		}
		setTimeout(async () => {
			if (user.email === value) {
				setUpdateCount((count) => count + 1) // increment the updateCount to trigger re-render
			}
		}, 500)
	}

	return (
		<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
			<section>
				<h2>Details</h2>
				<ul>
					<li>
						<strong>Your Name:</strong>{' '}
						<EditableField
							value={user?.displayName}
							validationError={(value) => {
								if (typeof value !== 'string' || value.length < 2) {
									return 'Must be at least 2 characters.'
								}
								return false
							}}
							onChange={handleDisplayNameChange}
						/>
					</li>
					<li>
						<strong>Your Email:</strong>{' '}
						<EditableField
							type='email'
							value={user?.email}
							validationError={(value) => {
								const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
								if (!emailPattern.test(value)) {
									return 'Must be a valid email address.'
								}
								return false
							}}
							onChange={handleEmailChange}
						/>
					</li>
					<li>
						<strong>Company Name:</strong> <EditableField value={'TODO'} />
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
