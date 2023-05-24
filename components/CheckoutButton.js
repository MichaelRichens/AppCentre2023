import React, { useContext } from 'react'
import { CartContext } from './contexts/CartContext'

const CheckoutButton = () => {
	const { cart, isCartLoading, getTotalItems } = useContext(CartContext)

	// This function will handle the process of creating a checkout session
	// by making a request to your server-side route
	async function handleCreateCheckoutSession() {
		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ items: cart }), // sending the cart details
			})

			if (!response.ok) {
				throw new Error(`Server responded with a status of ${response.status}`)
			}

			const stripeData = await response.json()

			return stripeData
		} catch (error) {
			console.error('Failed to create checkout session:', error.message)
		}
	}

	// When the button is clicked, it will trigger the checkout process
	async function handleCheckout() {
		const stripeData = await handleCreateCheckoutSession()
		if (stripeData?.sessionId) {
			sessionStorage.setItem('checkoutSessionId', stripeData.sessionId)

			window.location.href = stripeData.url
		}
	}

	return (
		<button type='button' disabled={!!(isCartLoading() || !getTotalItems())} onClick={handleCheckout}>
			Checkout
		</button>
	)
}

export default CheckoutButton
