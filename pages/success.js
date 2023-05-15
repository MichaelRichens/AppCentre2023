import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useShoppingCart } from 'use-shopping-cart'
import Page from '../components/Page'

const OrderSuccess = () => {
	const { clearCart, cartDetails, removeItem } = useShoppingCart()
	const router = useRouter()

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		let timeoutId
		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			//  HACKY WORKAROUND
			// clearCart isn't working on page load for some unknown reason, using a timeout to call it back makes it work
			// even with this, it still needs another hack - clearing the cart here doesn't force a rerender of the cart total
			// so it just sits there showing items in the cart even though it is empty.  'Fix' for this is just to hide the cart entirely on this page... (done in Header component)
			timeoutId = setTimeout(() => {
				clearCart()
			}, 200)
			sessionStorage.removeItem('checkoutSessionId')
		}
		return () => {
			sessionStorage.removeItem('checkoutSessionId')
			clearTimeout(timeoutId)
		}
	}, [])

	return (
		<Page title='Order Success'>
			<p>Thank you for your purchase!</p>
		</Page>
	)
}

export default OrderSuccess
