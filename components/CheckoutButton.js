import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useAuth } from './contexts/AuthContext'
import { CartContext } from './contexts/CartContext'
import { VersioningError } from '../utils/types/errors'
import accountStyles from '../styles/Account.shared.module.css'

const CheckoutButton = () => {
	const { user, isAuthLoading } = useAuth()
	const { cart, isCartLoading, getTotalItems } = useContext(CartContext)
	const [checkoutError, setCheckoutError] = useState(false)
	const [modalIsOpen, setModalIsOpen] = useState(false)

	useEffect(() => {
		setCheckoutError(false)
	}, [cart])

	const openModal = () => {
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

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

			if (response.ok) {
				const stripeData = await response.json()

				return stripeData
			}
			if (response.status === 410) {
				throw new VersioningError('Configuration outdated.')
			} else {
				throw new Error(`Server responded with a status of ${response.status}`)
			}
		} catch (error) {
			console.warn('Failed to create checkout session:')
			throw error
		}
	}

	// When the button is clicked, it will trigger the checkout process
	async function checkout() {
		setCheckoutError(false)
		try {
			const stripeData = await handleCreateCheckoutSession()
			if (stripeData?.sessionId) {
				sessionStorage.setItem('checkoutSessionId', stripeData.sessionId)

				window.location.href = stripeData.url
			}
		} catch (error) {
			if (error instanceof VersioningError) {
				setCheckoutError(
					'Error: Very sorry, one or more items in the cart are no longer valid. Please try removing them from your cart and re-adding them.'
				)
			} else {
				setCheckoutError('Error: Very sorry, an error has occurred that prevented checkout.')
			}
		}
	}

	async function handleCheckoutButtonClick() {
		if (user) {
			await checkout()
		} else {
			openModal()
		}
	}

	const modalInlineStyles = { overlay: { zIndex: 900 } }

	return (
		<>
			<button type='button' disabled={!!(isCartLoading || !getTotalItems())} onClick={handleCheckoutButtonClick}>
				Checkout
			</button>
			{checkoutError && <p className='onPageError'>{checkoutError}</p>}
			<Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalInlineStyles}>
				<h2 className={accountStyles.test}>Checkout</h2>
				<button onClick={closeModal}>Close</button>
			</Modal>
		</>
	)
}

export default CheckoutButton
