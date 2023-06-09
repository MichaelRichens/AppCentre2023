import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { CartContext } from '../components/contexts/CartContext'
import Page from '../components/page/Page'
import OrderDetails from '../components/account/OrderDetails'
import { useAuth } from '../components/contexts/AuthContext'
import { FlashMessageContext, MessageType } from '../components//contexts/FlashMessageContext'
import SignUp from '../components/account/SignUp'
import { getBaseUrlFromLocation } from '../utils/baseUrl'

// This page is where the user arrives back at our site after a successful checkout, and handles clean up of the cart and some data updating (though not marking the order as complete).
// There is a division of responsibility between this success page the user gets sent to after checkout, and the webhook handlers in pages/api/stripe-webhooks.
// This success page handles clearing the cart, and merging anon users into a full one
// The webhook events are used for updating orders documents, and also for managing linking of stripe customers with firebase users (ie adding the stripe customer id into the users firebase document in the users collection)
// Avoid duplicating responsibilities to avoid race conditions since many events will fire as the user is handed back to our site. (also its less work...)

const OrderSuccess = () => {
	const { user, anonymousUser, isAuthLoading } = useAuth()
	const { clearCart } = useContext(CartContext)
	const [sessionIdState, setSessionIdState] = useState(null)
	const [noUrlSessionId, setNoUrlSessionId] = useState(false)
	const [notFirstVisitToPage, setNotFirstVisitToPage] = useState(false)
	const [orderId, setOrderId] = useState(null)
	const [sessionDataState, setSessionDataState] = useState(null)

	const { setMessage } = useContext(FlashMessageContext)

	// For holding the base url this page is running on - requires window.location to be available, so need state populated inside a useEffect
	const [baseUrl, setBaseUrl] = useState(null)
	useEffect(() => {
		setBaseUrl(getBaseUrlFromLocation(window.location))
	}, [])

	// On first render, check that this is a valid fresh return from a successful stripe checkout, and clean if so, and store the stripe session id is sessionIdState
	useEffect(() => {
		/** Helper function to perform removal of sessionStorage checkout data and clear the user's cart */
		function cleanUpAfterCheckout() {
			sessionStorage.removeItem('checkoutSessionId')
			clearCart()
		}

		// Check that the url has a stripe session id parameter and that the user has the same one stored in sessionStorage
		const urlParams = new URLSearchParams(window.location.search)
		const urlSessionId = urlParams.get('session_id')
		const sessionStorageSessionId = sessionStorage.getItem('checkoutSessionId')

		/*
		// For testing only!!  Lets us repeatedly reload page and rerun logic  - LEAVE COMMENTED OUT FOR PROD!!
		if (urlSessionId) {
			setSessionIdState(urlSessionId)
		}
		*/

		if (!urlSessionId && window?.location) {
			setNoUrlSessionId(true)
		}

		// If so, set it in a state variable and removed it from their sessionStorage so this won't get processed again if they return to this page.
		if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
			setSessionIdState(urlSessionId)
			cleanUpAfterCheckout()
		} else {
			setNotFirstVisitToPage(true)
		}

		// Basic cleanup to account for someone closing the page without giving it time to do its thing - they won't get their details updated from stripe, but we can at least clear their cart.
		return () => {
			if (urlSessionId && sessionStorageSessionId && urlSessionId === sessionStorageSessionId) {
				cleanUpAfterCheckout()
			}
		}
	}, [])

	// Once auth is available and if a fresh stripe sessionId has been set, fetch full session data from stripe and put into sessionDataState
	useEffect(() => {
		if (isAuthLoading || !sessionIdState) {
			return
		}
		// Can be either an anonymous or logged in user
		const returnedUser = user || anonymousUser

		if (!returnedUser) {
			// no user is handled in the component return
			return
		}

		const asyncProcessCheckoutSession = async () => {
			// fetch the stripe session from the sessionId we have for the completed order
			try {
				const idToken = await returnedUser.getIdToken()
				const response = await fetch('/api/get-stripe-checkout-session', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${idToken}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						sessionId: sessionIdState,
					}),
				})

				const data = await response.json()
				const session = data?.session

				// We do not update the order - this is handled by the event handler side of things - but we will want to update the user details with anything they entered on stripe.
				// So put the session data into a state variable which will allow another useEffect if they are logged into a full account
				// and if the user checked out anonymously, the showing of a log in screen which can upgrade them to a full account which if they use it, will then trigger the next use effect
				if (!session) {
					setMessage({ text: 'Error finding order', type: MessageType.ERROR })
					return
				}

				setSessionDataState(session)
			} catch (error) {
				setMessage({ text: 'Error loading order', type: MessageType.ERROR })
				return
			}
		}

		asyncProcessCheckoutSession()
	}, [sessionIdState, isAuthLoading])

	useEffect(() => {
		// this logic is only for logged in users and session data stored in state
		if (!(user || anonymousUser) || !sessionDataState) {
			return
		}

		setOrderId(sessionDataState?.metadata?.orderId)
	}, [sessionDataState, user])

	if (noUrlSessionId) {
		return (
			<Page title='Invalid Url'>
				<p>This url is not valid.</p>
			</Page>
		)
	}

	if (!(anonymousUser || user) || notFirstVisitToPage) {
		return (
			<Page title='Page No Longer Valid'>
				<p>
					Sorry, this page is no longer valid.{' '}
					{user ? (
						<span>
							You can find details of your orders in your <Link href='/account'>account</Link>.
						</span>
					) : anonymousUser ? (
						<span>
							If you <Link href='/account'>create an account</Link> you can get access to your receipt.
						</span>
					) : (
						<span>
							Please <Link href='/account'>login to your account</Link> to see details of your previous orders.
						</span>
					)}
				</p>
			</Page>
		)
	}

	if (!sessionDataState) {
		return (
			<Page title='Checking Order'>
				<p>Please wait...</p>
			</Page>
		)
	}

	if (sessionDataState?.status !== 'complete') {
		return (
			<Page title='Order Error'>
				<p>Very sorry, there has been a problem.</p>
			</Page>
		)
	}

	return (
		<Page title='Order Success'>
			<p>Thank you for your purchase!</p>
			<p>We will process your order with GFI, it normally takes around 2 working days for subscriptions to go live.</p>
			<p>
				For renewals or changes to existing subscriptions, your server should update automatically as soon as GFI
				completes processing.
			</p>
			<p>For new subscriptions you will receive your licence details be email as soon as they are available.</p>
			{!!(anonymousUser && sessionDataState) && (
				<>
					<p>
						If you do not choose to create an account, emails will be sent to the email address you entered while making
						payment.
					</p>
					<SignUp
						title='Would you like to create an account?'
						prefillEmail={sessionDataState?.customer_details?.email}
						prefillFullName={sessionDataState?.customer_details?.name}
					/>
				</>
			)}

			{orderId && (
				<>
					{!!anonymousUser && (
						<p>
							If you do not create an account, please download a copy of your receipt now since it will not be available
							to you online after you leave this page (though we can provide you with a copy if you contact us later).
						</p>
					)}
					<OrderDetails orderId={orderId} />
				</>
			)}
			{user && (
				<p>
					See this order in your account:, <Link href={`order/${orderId}`}>click here</Link>.
				</p>
			)}
		</Page>
	)
}

export default OrderSuccess
