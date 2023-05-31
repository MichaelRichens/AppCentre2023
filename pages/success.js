import React, { useEffect, useState, useContext } from 'react'
import { updateEmail } from 'firebase/auth'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/page/Page'
import { useAuth } from '../components/contexts/AuthContext'
import SignUp from '../components/account/SignUp'

// This page is where the user arrives back at our site after a successful checkout, and handles clean up of the cart and some data updating (though not marking the order as complete).
// There is a division of responsibility between this success page the user gets sent to after checkout, and the webhook handlers in pages/api/stripe-webhooks.
// This success page handles clearing the cart, and also merging user details (eg addresses) that might have been given/updated during checkout back with our system
// The webhook events are used for updating order statuses, and also for managing linking of stripe customers with firebase users (ie adding the stripe customer id into the users firebase document in the users collection)
// Avoid duplicating responsibilities to avoid race conditions since many events will fire as the user is handed back to our site. (also its less work...)

const OrderSuccess = () => {
	const { user, anonymousUser, isAuthLoading } = useAuth()
	const { clearCart } = useContext(CartContext)
	const [sessionIdState, setSessionIdState] = useState(null)
	const [sessionDataState, setSessionDataState] = useState(null)

	// On first render, check that this is a valid fresh return from a successful stripe checkout, and clean if so, and store the stripe session id is sessionIdState
	useEffect(() => {
		/** Helper function to perform removal of sessionStorage checkout data and clear the user's cart */
		function cleanUpAfterCheckout() {
			sessionStorage.removeItem('checkoutSessionId')
			clearCart()
		}

		// Check that the url has a stripe session id parameter and that the user has the same one stored in sessionStorage
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		// For testing only!!  Lets us repeatedly reload page and rerun logic  TODO DELETE THIS!!!
		if (urlSessionId) {
			setSessionIdState(urlSessionId)
		}

		// If so, set it in a state variable and removed it from their sessionStorage so this won't get processed again if they return to this page.
		// TODO, might want to redirect the order if a customer does return here, or visits without the session id parameter
		// The order page (not created yet) will be withAuth, so will handle them not being logged in
		// Wouldn't work for anonymous users though, so maybe just display the order here is long as their firebase user id matches it?
		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			setSessionIdState(urlSessionId)
			cleanUpAfterCheckout()
		}

		// Basic cleanup to account for someone closing the page without giving it time to do its thing - they won't get their details updated from stripe, but we can at least clear their cart.
		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				cleanUpAfterCheckout()
			}
		}
	}, [])

	// Once auth is available and if a fresh stripe sessionId has been set, fetch full session data from stripe and put into sessionDataState
	useEffect(() => {
		if (isAuthLoading || !sessionIdState) {
			return
		}
		// Can be either an anonymous or logged in user
		const returnedUser = user || anonymousUser

		if (!returnedUser) {
			console.error('Cannot find user.')
			return
		}

		const asyncProcessCheckoutSession = async () => {
			// fetch the stripe session from the sessionId we have for the completed order
			try {
				const idToken = await returnedUser.getIdToken()
				const response = await fetch('/api/get-stripe-checkout-session', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${idToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						sessionId: sessionIdState,
					}),
				})

				const data = await response.json()
				const session = data?.session

				// We do not update the order - this is handled by the event handler side of things - but we will want to update the user details with anything they entered on stripe.
				// So put the session data into a state variable which will allow another useEffect if they are logged into a full account
				// and if the user checked out anonymously, the showing of a log in screen which can upgrade them to a full account which if they use it, will then trigger the next use effect
				if (!session) {
					console.error('Did not receive a valid session')
					return
				}

				setSessionDataState(session)
			} catch (error) {
				console.error('There was an error receiving sessionIdState: ', error)
				return
			}
		}

		asyncProcessCheckoutSession()
		// when complete, unset this state to prevent any chance of doing this useEffect logic again
		setSessionDataState(null)
	}, [sessionIdState, isAuthLoading])

	// Once we have sessionDataState, and if we have (or get from SignUp component being used) a logged in user, we can merge stripe data into customer data
	useEffect(() => {
		// this logic is only for logged in users and session data stored in state
		if (!user || !sessionDataState) {
			return
		}
		console.log(sessionDataState)
		// probably customer_details for billing address, and maybe shipping_details if there is a shipping address
		// TODO NEXT

		// when complete, unset this state to prevent any chance of doing this useEffect logic again
		setSessionDataState(null)
	}, [sessionDataState, user])

	return (
		<Page title='Order Success'>
			<p>Thank you for your purchase!</p>
			{anonymousUser && sessionDataState && (
				<SignUp title='Would you like to create an account?' prefillEmail={sessionDataState?.customer_details?.email} />
			)}
		</Page>
	)
}

export default OrderSuccess
