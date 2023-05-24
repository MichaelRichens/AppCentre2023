import React, { useEffect, useState } from 'react'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/Page'

const OrderSuccess = () => {
	const { clearCart, cartDetails, removeItem } = useShoppingCart()
	const [sessionIdState, setSessionIdState] = useState(null)

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')
		// tmp for testing api - use the commented out call inside the first load check
		setSessionIdState(urlSessionId)
		let timeoutId

		const hackyClearCart = () => {
			localStorage.removeItem(process.env.NEXT_PUBLIC_CART_PERSIST_KEY)
		}

		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			//this is where the state should be saved, though not 100% sure sessionStorageSessionId is the right source, but it probably is
			//setSessionIdState(sessionStorageSessionId)

			//  HACKY WORKAROUND
			// clearCart isn't working on page load for some unknown reason, so removing cart from localStorage directly
			// suspect this may be related to use-shopping-cart wanting React 17, but having React 18 installed
			hackyClearCart()
			// However testing on Chrome on Android on my phone, the above doesn't work.  So...
			// Do it again after a timeout...
			// When this happens, it doesn't trigger a rerender of the cart component, so we've also have to hide the cart entirely on the success page
			timeoutId = setTimeout(() => {
				hackyClearCart()
			}, 500)

			sessionStorage.removeItem('checkoutSessionId')
		}
		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				sessionStorage.removeItem('checkoutSessionId')
				// Just to be on the safe side, we'll clear the bloody cart here as well.
				hackyClearCart()
			}
			clearTimeout(timeoutId)
		}
	}, [])

	useEffect(() => {
		if (sessionIdState) {
			const asyncProcessCheckoutSession = async () => {
				try {
					const response = await fetch('/api/process-successful-checkout', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							sessionId: sessionIdState,
						}),
					})
					//console.log(response)
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
