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
import ReauthenticatePassword from '../components/account/ReauthenticatePassword'

import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()

	// The reauthState object has two properties - `needed`, which is boolean, and is a flag for whether the user needs to reauthenticate their account be re-entering their password to perform a sensitive operation
	// And `function` which is only ever used when `needed` is truthy, and is the function to pass as the onSuccess parameter of the ReauthenticatePassword component. (Pass it setReauthState({ needed: false })) for its onCancel)
	const [reauthState, setReauthState] = useState({ needed: false })

	// userDetails is used to hold an updating firebase snapshot of the user's document in the firestore `users` collection
	const [userDetails, setUserDetails] = useState({})

	// updateCount is a hack - react rerendering does not play nice with the firebase user profile object since it maintains reference equality when changes are made.  We increment a counter when changing it, and trigger a rerender when it changes.
	const [updateCount, setUpdateCount] = useState(0)

	const { setMessage } = useContext(FlashMessageContext)

	// Empty useEffect to trigger rerender when updateCount change lets us know about a change to the user profile.
	useEffect(() => {}, [updateCount])

	// Hold an updating snapshot of the user's `users` document in the userDetails state object
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

	// Updating the firebase profile displayName requires two hacks.
	// 1. updateCount state variable is incremented to manually trigger a rerender that would not otherwise happen when the user's firebase profile is called.
	// 2.  This is done on a timeout to introduce a delay, since awaiting updateProfile does not mean the change will have taken effect, so an immediate rerender won't catch the change.
	// 500ms seems more than enough in testing (100ms worked fine) but no doubt it will fail occasionally - could use a setInterval, but cleaning up the timer requires a lot of nearly always useless code.
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

	// Changing email requires the same hacks as the handleDisplayNameChange
	// Also handles 'auth/requires-recent-login' error that firebase will throw unless the user has only recently logged in
	// Sets reauthState to call itself back after the reauthentication component has been rendered in and completed by the user successfully.
	const handleEmailChange = async (value) => {
		try {
			await updateEmail(user, value)
		} catch (error) {
			if (error?.code === 'auth/requires-recent-login') {
				setReauthState({
					needed: true,
					function: async () => {
						await handleEmailChange(value)
					},
				})
			} else {
				setMessage({
					text: translateFirebaseError(error),
					type: MessageType.ERROR,
				})
			}
			return
		}
		setTimeout(async () => {
			if (user.email === value) {
				setUpdateCount((count) => count + 1) // increment the updateCount to trigger re-render
			}
		}, 500)
	}

	// If reauthState has been set, just render in a page with a component to handle reauthentication
	if (reauthState.needed) {
		return (
			<Page title='Please confirm your password'>
				<ReauthenticatePassword
					onSuccess={() => {
						reauthState.function()
						setReauthState({ needed: false })
					}}
					onCancel={() => setReauthState({ needed: false })}
				/>
			</Page>
		)
	} else {
		// Otherwise show the page
		return (
			<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
				<section>
					<h2>Details</h2>
					<ul>
						<li>
							<strong>Your Name:</strong>{' '}
							<EditableField
								value={user?.displayName}
								emptyValueText='ERROR'
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
								emptyValueText='ERROR'
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
							<strong>Company Name:</strong> <EditableField value={'TODO'} emptyValueText='(None)' />
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
}

export default withAuth(Account)
