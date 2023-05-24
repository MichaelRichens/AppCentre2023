import React, { useEffect, useState } from 'react'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/Page'

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
