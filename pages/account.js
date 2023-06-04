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
import { doc, onSnapshot, getDoc, setDoc, updateDoc, deleteField, serverTimestamp } from 'firebase/firestore'
import EditableField from '../components/EditableField'
import ReauthenticatePassword from '../components/account/ReauthenticatePassword'
import ChangePassword from '../components/account/ChangePassword'

import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()

	// The reauthState object has two properties - `needed`, which is boolean, and is a flag for whether the user needs to reauthenticate their account be re-entering their password to perform a sensitive operation
	// And `function` which is only ever used when `needed` is truthy, and is the function to pass as the onSuccess parameter of the ReauthenticatePassword component. (Pass it setReauthState({ needed: false })) for its onCancel)
	const [reauthState, setReauthState] = useState({ needed: false })

	const [changePassword, setChangePassword] = useState(false)

	const [userDocRef, setUserDocRef] = useState(null)

	// userDetails is used to hold an updating firebase snapshot of the user's document in the firestore `users` collection
	const [userDetails, setUserDetails] = useState({})

	// updateCount is a hack - react rerendering does not play nice with the firebase user profile object since it maintains reference equality when changes are made.  We increment a counter when changing it, and trigger a rerender when it changes.
	const [updateCount, setUpdateCount] = useState(0)

	const { setMessage } = useContext(FlashMessageContext)

	// Empty useEffect to trigger rerender when updateCount change lets us know about a change to the user profile.
	useEffect(() => {}, [updateCount])

	// Hold an updating snapshot of the user's `users` document in the userDetails state object, and keep their docRef as well in the userDocRef state object for future edits
	useEffect(() => {
		let unsubscribeUsers
		try {
			const docRef = doc(firestore, 'users', user.uid)
			setUserDocRef(docRef)

			unsubscribeUsers = onSnapshot(docRef, (docSnap) => {
				if (docSnap.exists()) {
					const data = docSnap.data()
					setUserDetails(data)
				}
			})
		} catch (error) {
			setMessage({ text: translateFirebaseError(error), value: MessageType.ERROR })
			unsubscribeUsers = () => {}
			return
		}

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeUsers()
		}
	}, [user])

	// Handlers for user details changes

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
			return
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

	const handleBusinessNameChange = async (value) => {
		if (!userDocRef) {
			setMessage({ text: 'Business Name update failed.', type: MessageType.ERROR })
			console.error('Missing reference to users document.')
			return
		}
		try {
			if (!value || typeof value !== 'string') {
				if (!userDetails?.businessName) {
					// They didn't have a business name to begin with - no change
					return
				}
				await updateDoc(userDocRef, { businessName: deleteField(), updatedAt: serverTimestamp() })
				return
			}
			// The validation function should stop this, but we'll check here as well and truncate.
			value = value.substring(0, 50)

			const docSnap = await getDoc(userDocRef)
			if (docSnap.exists()) {
				await updateDoc(userDocRef, { businessName: value, updatedAt: serverTimestamp() })
			} else {
				await setDoc(userDocRef, { businessName: value, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
			}
			return
		} catch (error) {
			setMessage({
				text: translateFirebaseError(error),
				type: MessageType.ERROR,
			})
			return
		}
	}

	// Validation functions for user details changes - these are passed to the EditableField components for immediate validation to give user feedback while editing.

	const fullNameVal = (value) => {
		if (typeof value !== 'string' || value.length < 2) {
			return 'Must be at least 2 characters.'
		}
		if (value.length > 40) {
			return '40 characters max.'
		}
		return false
	}

	const emailAddressVal = (value) => {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (typeof value !== 'string' || value.length < 5 || !emailPattern.test(value)) {
			return 'Must be a valid email address.'
		}
		if (value.length > 50) {
			return '50 characters max.'
		}
		return false
	}

	const businessNameVal = (value) => {
		if (value && typeof value !== 'string') {
			return 'Must be text.  Leave empty to remove business name from your account.'
		}
		if (value.length > 50) {
			return '50 characters max.'
		}
		return false
	}

	// If reauthState object has been set as needed == true, render in a page with a component to handle reauthentication, passing it a function to call when complete (to finish the operation that needed reauthentication)
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
	} else if (changePassword) {
		// if changePassword state boolean is true, render in a page to handle password change, passing it a simple function which just sets the state back to false when the user exits - password change logic happens within this component
		return (
			<Page title='Change Password' mainClassName={accountStyles.accountDetailsPage}>
				<ChangePassword onExit={() => setChangePassword(false)} />
			</Page>
		)
	} else {
		//Otherwise, render the normal page
		return (
			<Page title='Account' mainClassName={accountStyles.accountDetailsPage}>
				<section className={accountStyles.accountDetails}>
					<h2>Account Details</h2>
					<ul>
						<li>
							<strong>Your Name:</strong>{' '}
							<EditableField
								value={user?.displayName}
								emptyValueText='ERROR'
								validationError={fullNameVal}
								onChange={handleDisplayNameChange}
							/>
						</li>
						<li>
							<strong>Business Name:</strong>{' '}
							<EditableField
								value={userDetails?.businessName}
								emptyValueText='(None)'
								validationError={businessNameVal}
								onChange={handleBusinessNameChange}
							/>
						</li>
						<li>
							<strong>Email Address:</strong>{' '}
							<EditableField
								type='email'
								value={user?.email}
								emptyValueText='ERROR'
								validationError={emailAddressVal}
								onChange={handleEmailChange}
							/>
						</li>
					</ul>
					<h3>Change Password</h3>
					<div className={accountStyles.passwordChange}>
						<button type='button' onClick={() => setChangePassword(true)}>
							Click Here To Change Password
						</button>
					</div>
				</section>
				<section className={accountStyles.orderHistory}>
					<h2>Order History</h2>
					<CustomerOrders />
				</section>
			</Page>
		)
	}
}

export default withAuth(Account)
