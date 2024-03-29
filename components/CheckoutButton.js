import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { LineWave } from 'react-loader-spinner'
import { useAuth } from './contexts/AuthContext'
import { auth, firestore, translateFirebaseError } from '../utils/firebaseClient'
import { signInAnonymously } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { CartContext } from './contexts/CartContext'
import { FlashMessageContext, MessageType } from './contexts/FlashMessageContext'
import SignInOrSignUp from './account/SignInOrSignUp'
import BusyButton from './BusyButton'
import { VersioningError } from '../utils/types/errors'
import accountStyles from '/styles/Account.shared.module.css'
import { getModalBaseStyleObject } from '/styles/modalBaseStyleObject'

const CheckoutButton = () => {
	const { user, anonymousUser, isAuthLoading } = useAuth()

	const { cart, isCartLoading, getTotalItems } = useContext(CartContext)

	const [modalIsOpen, setModalIsOpen] = useState(false)

	const [checkingOut, setCheckingOut] = useState(false)

	const { setMessage } = useContext(FlashMessageContext)

	// Once the user has logged in or created an account, if the checkout modal is open, get them checked out immediately
	// This flow may not stick around, but try it like this for the moment
	useEffect(() => {
		if (modalIsOpen && !isAuthLoading && user) {
			checkout()
		}
	}, [modalIsOpen, user, isAuthLoading])

	const openModal = () => {
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	// This function will handle the process of creating a checkout session
	// by making a request to the server-side route
	async function handleCreateCheckoutSession() {
		const checkoutSessionData = { items: cart, customerDetails: {} }
		let actualUser = user || anonymousUser
		// get user data from firestore
		if (actualUser) {
			// we have an existing user, either logged in or anonymous.  Populate checkoutSessionData with info
			// Stripe customer id - to go to stripe
			// Name fields - will be populated into the orders document
			checkoutSessionData.customerDetails.email = actualUser?.email
			checkoutSessionData.customerDetails.fullName = actualUser?.displayName

			// And if the have one, their business name and stripe customer id.  (If it doesn't exist, a stripe customer id will be created during checkout and linked up afterwards)
			try {
				const userDocRef = doc(firestore, 'users', actualUser.uid)
				const docSnap = await getDoc(userDocRef)
				if (docSnap.exists()) {
					const data = docSnap.data()

					// data from the orders document
					checkoutSessionData.customerDetails.stripeCustomerId = data?.stripeCustomerId
					checkoutSessionData.customerDetails.businessName = data?.businessName
				}
			} catch (error) {
				// rethrow and let caller handle it
				throw error
			}
		} else {
			// No user is signed in, so sign in anonymously
			try {
				const userCredential = await signInAnonymously(auth)

				actualUser = userCredential.user
			} catch (error) {
				// Just rethrow for the handler in the caller to deal with.
				throw error
			}
		}

		// populate checkoutSessionData with the uid of either the existing or newly created user
		checkoutSessionData.customerDetails.firebaseUserId = actualUser.uid

		// and generate a token with the uid
		const idToken = await actualUser.getIdToken()

		// call api to get the stripe checkout session
		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${idToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(checkoutSessionData), // sending the cart details
			})

			if (response.ok) {
				const stripeData = await response.json()

				return stripeData
			}
			if (response.status === 410) {
				throw new VersioningError('Configuration outdated.')
			} else {
				throw new Error(`Server responded with a status of ${response.status}`)
			}
		} catch (error) {
			// Just rethrow for the handler in the caller to deal with.
			throw error
		}
	}

	// When the button is clicked, it will trigger the checkout process
	async function checkout() {
		setCheckingOut(true)
		try {
			const stripeData = await handleCreateCheckoutSession()
			if (stripeData?.sessionId) {
				sessionStorage.setItem('checkoutSessionId', stripeData.sessionId)

				window.location.href = stripeData.url
			}
		} catch (error) {
			setCheckingOut(false)
			if (error instanceof VersioningError) {
				setMessage({
					text: 'Error: Very sorry, one or more items in the cart are no longer valid. Please try removing them from your cart and re-adding them.',
					type: MessageType.ERROR,
				})
			} else {
				setMessage({
					text: 'Error: Very sorry, an error has occurred that prevented checkout.',
					type: MessageType.ERROR,
				})
			}
		}
	}

	async function handleCheckoutButtonClick() {
		if (user) {
			await checkout()
		} else {
			openModal()
		}
	}

	const modalStyles = getModalBaseStyleObject()

	modalStyles.overlay.zIndex = 900

	return (
		<div className={accountStyles.checkoutButtonWrapper}>
			<BusyButton
				isBusy={checkingOut}
				type='button'
				disabled={!!(isCartLoading || !getTotalItems())}
				onClick={handleCheckoutButtonClick}>
				Checkout
			</BusyButton>
			<Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
				<div className='modalInnerWrapper'>
					<button className='modalCloseButton' onClick={closeModal} aria-label='Close checkout'>
						X
					</button>
					<h1 className={accountStyles.test}>Checkout Options</h1>
					{isAuthLoading ? (
						<div style={{ paddingLeft: '25%' }}>
							<LineWave width='600' height='600' color='#4fa94d' />
						</div>
					) : !checkingOut && !user ? (
						<>
							<h2>Checkout as a guest</h2>
							<div className={accountStyles.signInUpFormWrapper}>
								<form onSubmit={checkout}>
									<button type='submit'>Guest Checkout</button>
								</form>
							</div>
							<h2>Or with an account</h2>
							<SignInOrSignUp />
						</>
					) : (
						<p>Checking out order...</p>
					)}
				</div>
			</Modal>
		</div>
	)
}

export default CheckoutButton
