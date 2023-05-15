import React, { useEffect, useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import Page from '../components/Page'
import generateUniqueId from '../utils/generateUniqueId'

const OrderSuccess = () => {
	const { clearCart, cartDetails, removeItem } = useShoppingCart()
	const [key, setKey] = useState(generateUniqueId())

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		var timeoutId
		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			//  HACKY WORKAROUND
			// clearCart isn't working on page load for some unknown reason, using a timeout to call it back makes it work
			timeoutId = setTimeout(() => {
				clearCart()
				setKey(generateUniqueId()) // change key to force re-render
			}, 1000)
			sessionStorage.removeItem('checkoutSessionId')
		}
		return () => {
			sessionStorage.removeItem('checkoutSessionId')
			clearTimeout(timeoutId)
		}
	}, [])

	return (
		<Page key={key} title='Order Success'>
			<p>Thank you for your purchase!</p>
		</Page>
	)
}

export default OrderSuccess
