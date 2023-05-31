import React, { useEffect, useState, useContext } from 'react'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/page/Page'
import { useAuth } from '../components/contexts/AuthContext'

// This page is where the user arrives back at our site after a successful checkout, and handles clean up of the cart and some data updating (though not marking the order as complete).
// There is a division of responsibility between this success page the user gets sent to after checkout, and the webhook handlers in pages/api/stripe-webhooks.
// This success page handles clearing the cart, and also merging user details (eg addresses) that might have been given/updated during checkout back with our system
// The webhook events are used for updating order statuses, and also for managing linking of stripe customers with firebase users (ie adding the stripe customer id into the users firebase document in the users collection)
// Avoid duplicating responsibilities to avoid race conditions since many events will fire as the user is handed back to our site. (also its less work...)

const OrderSuccess = () => {
	const { user, anonymousUser, isAuthLoading } = useAuth()
	const { clearCart } = useContext(CartContext)
	const [sessionIdState, setSessionIdState] = useState(null)

	useEffect(() => {
		// Check that the url has a stripe session id parameter and that the user has the same one stored in sessionStorage
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		// For testing only!!
		if (urlSessionId) {
			setSessionIdState(urlSessionId)
		}

		// If so, set it in a state variable and removed it from their sessionStorage so this won't get processed again if they return to this page.
		// TODO, might want to redirect the order if a customer does return here, or visits without the session id parameter
		// The order page (not created yet) will be withAuth, so will handle them not being logged in
		// Wouldn't work for anonymous users though, so maybe just display the order here is long as their firebase user id matches it?
		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			setSessionIdState(urlSessionId)
			sessionStorage.removeItem('checkoutSessionId')
			clearCart()
		}

		// Basic cleanup to account for someone closing the page without giving it time to do its thing - they won;t get their details updated from stripe, but we can at least clear their cart.
		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				sessionStorage.removeItem('checkoutSessionId')
				clearCart()
			}
		}
	}, [])

	useEffect(() => {
		// Process fresh return from checkout once auth is available and if a fresh stripe sessionId has been set.
		if (!isAuthLoading && sessionIdState) {
			// Can be either an anonymous or logged in user
			const returnedUser = user || anonymousUser

			if (returnedUser) {
				const asyncProcessCheckoutSession = async () => {
					const idToken = await returnedUser.getIdToken()

					try {
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
						console.log(data)
					} catch (error) {
						console.error('There was an error handing sessionIdState: ', error)
					}
				}
				asyncProcessCheckoutSession()
			} else {
				console.error('No user found - need to handle this.')
			}
		}
	}, [sessionIdState, isAuthLoading])

	return (
		<Page title='Order Success'>
			<p>Thank you for your purchase!</p>
		</Page>
	)
}

export default OrderSuccess
