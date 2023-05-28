import React, { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { LineWave } from 'react-loader-spinner'
import { useAuth } from './contexts/AuthContext'
import { CartContext } from './contexts/CartContext'
import SignInOrSignUp from './account/SignInOrSignUp'
import { VersioningError } from '../utils/types/errors'
import accountStyles from '../styles/Account.shared.module.css'
import { getModalBaseStyleObject } from '../styles/modalBaseStyleObject'

const CheckoutButton = () => {
	const { user, isAuthLoading } = useAuth()
	const { cart, isCartLoading, getTotalItems } = useContext(CartContext)
	const [checkoutError, setCheckoutError] = useState(false)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [checkingOut, setCheckingOut] = useState(false)

	useEffect(() => {
		setCheckoutError(false)
	}, [cart])

	// Once the user has logged in or created an account, if the checkout modal is open, get them checked out immediately
	// This flow may not stick around, but try it like this for the moment
	useEffect(() => {
		if (modalIsOpen && !isAuthLoading && user) {
			checkout()
		}
	}, [modalIsOpen, user, isAuthLoading])

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
		setCheckingOut(true)
		setCheckoutError(false)
		try {
			const stripeData = await handleCreateCheckoutSession()
			if (stripeData?.sessionId) {
				sessionStorage.setItem('checkoutSessionId', stripeData.sessionId)

				window.location.href = stripeData.url
			}
		} catch (error) {
			setCheckingOut(false)
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

	const modalStyles = getModalBaseStyleObject()

	modalStyles.overlay.zIndex = 900

	return (
		<>
			<button type='button' disabled={!!(isCartLoading || !getTotalItems())} onClick={handleCheckoutButtonClick}>
				Checkout
			</button>
			{checkoutError && <p className='onPageError'>{checkoutError}</p>}
			<Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
				<div className='modalInnerWrapper'>
					<button className='modalCloseButton' onClick={closeModal} aria-label='Close checkout'>
						X
					</button>
					<h2 className={accountStyles.test}>Checkout Options</h2>
					{isAuthLoading ? (
						<div style={{ paddingLeft: '25%' }}>
							<LineWave width='600' height='600' color='#4fa94d' />
						</div>
					) : !checkingOut && !user ? (
						<>
							<div className={accountStyles.signInUpFormWrapper}>
								<form onSubmit={checkout}>
									<button type='submit'>Checkout As A Guest</button>
								</form>
							</div>
							<SignInOrSignUp />
						</>
					) : (
						<p>Checking out order...</p>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CheckoutButton
