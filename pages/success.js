import React, { useEffect, useState, useContext } from 'react'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/page/Page'

// This page is where the user arrives back at our site after a successful checkout, and handles clean up of the cart and some data updating (though not marking the order as complete).
// There is a division of responsibility between this success page the user gets sent to after checkout, and the webhook handlers in pages/api/stripe-webhooks.
// This success page handles clearing the cart, and also merging user details (eg addresses) that might have been given/updated during checkout back with our system
// The webhook events are used for updating order statuses, and also for managing linking of stripe customers with firebase users (ie adding the stripe customer id into the users firebase document in the users collection)
// Avoid duplicating responsibilities to avoid race conditions since many events will fire as the user is handed back to our site (also its less work...)

const OrderSuccess = () => {
	const { clearCart } = useContext(CartContext)
	const [sessionIdState, setSessionIdState] = useState(null)

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			setSessionIdState(urlSessionId)
			sessionStorage.removeItem('checkoutSessionId')
			clearCart()
		}

		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				sessionStorage.removeItem('checkoutSessionId')
				clearCart()
			}
		}
	}, [])

	useEffect(() => {
		if (sessionIdState) {
			//console.log(sessionIdState)
			const asyncProcessCheckoutSession = async () => {
				try {
				} catch (error) {
					console.error('There was an error handing sessionIdState: ', error)
				}
			}
			asyncProcessCheckoutSession()
		}
	}, [sessionIdState])

	return (
		<Page title='Order Success'>
			<p>Thank you for your purchase!</p>
		</Page>
	)
}

export default OrderSuccess
