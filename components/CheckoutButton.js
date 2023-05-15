import React from 'react'
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart'
import { loadStripe } from '@stripe/stripe-js'

// load the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const CheckoutButton = () => {
	const { redirectToCheckout, cartDetails, cartCount, clearCart } = useShoppingCart()

	// This function will handle the process of creating a checkout session
	// by making a request to your server-side route
	async function handleCreateCheckoutSession() {
		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ items: Object.values(cartDetails) }), // sending the cart details
			})

			if (!response.ok) {
				throw new Error(`Server responded with a status of ${response.status}`)
			}

			const { sessionId } = await response.json()

			return sessionId
		} catch (error) {
			console.error('Failed to create checkout session:', error.message)
		}
	}

	// When the button is clicked, it will trigger the checkout process
	async function handleCheckout() {
		const sessionId = await handleCreateCheckoutSession()
		console.log(sessionId)

		const stripe = await stripePromise
		const { error } = await stripe.redirectToCheckout({ sessionId })

		// You can handle any errors from the Stripe checkout redirection here
		if (error) {
			console.warn('Error:', error)
		}
	}

	return (
		<button type='button' disabled={!cartCount} onClick={handleCheckout}>
			Checkout
		</button>
	)
}

export default CheckoutButton
