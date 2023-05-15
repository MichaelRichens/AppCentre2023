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

		const hackyClearCart = () => {
			localStorage.setItem(process.env.NEXT_PUBLIC_CART_PERSIST_KEY, JSON.stringify({}))
		}

		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			//  HACKY WORKAROUND
			// clearCart isn't working on page load for some unknown reason, so removing cart from localStorage directly
			// suspect this may be related to use-shopping-cart wanting React 17, but having React 18 installed
			hackyClearCart()

			timeoutId = setTimeout(() => {
				hackyClearCart()
			}, 500)

			sessionStorage.removeItem('checkoutSessionId')
		}
		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				hackyClearCart()
				sessionStorage.removeItem('checkoutSessionId')
			}
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
