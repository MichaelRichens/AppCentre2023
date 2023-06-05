import React, { useEffect, useState } from 'react'
import { onSnapshot, collection, where, query, getDocs, doc } from 'firebase/firestore'
import { useAuth } from '/components/contexts/AuthContext'
import { firestore } from '/utils/firebaseClient'
import { countryCodeToName } from '/utils/countryLookup'

import accountStyles from '/styles/Account.shared.module.css'

const OrderDetails = ({ orderId }) => {
	const { user } = useAuth()

	// Holds the details of the order looked up in firestore, or false if not found.
	// Initial state of null indicates that the lookup is in progress.
	const [order, setOrder] = useState(null)

	useEffect(() => {
		let unsubscribeOrders = () => {} // empty default function since this gets called in the useEffect cleanup return

		const getOrder = async () => {
			//Find the order document that matches orderId

			// reference to the collection
			const ordersRef = collection(firestore, 'orders')

			// Find the matching document
			// Doing a query by firebaseUserId first is required by the permissions that are on the orders collection
			const q = query(ordersRef, where('firebaseUserId', '==', user.uid), where('orderId', '==', orderId))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.size !== 1) {
				// if we don't find a document, this order does not exist or does not belong to this user (we literally can't tell the difference when logged in as this user)
				if (!querySnapshot.size) {
					throw new Error('NOT_FOUND')
				}
				throw new Error(`Found ${querySnapshot.size} order with the same order id - this should never happen.`)
			}

			// Get a reference to the document
			let docRef
			querySnapshot.forEach((document) => {
				docRef = document.ref
			})

			// And setup a listener on it
			unsubscribeOrders = onSnapshot(docRef, (doc) => {
				setOrder(doc.data())
			})
		}

		// If we have an orderId, get a listener set up on the order document
		if (orderId) {
			getOrder().catch((error) => {
				// If it wasn't found, we setOrder to false, which displays a relevant page.  Other errors it will just stay in the Loading state indefinitely
				if (error.message === 'NOT_FOUND') {
					setOrder(false)
				} else {
					console.error(error)
				}
			})
		}

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [orderId])

	// Lookup in progress - could use a spinner here, but the user will likely have seen one already waiting for auth to load
	// Having this component pop in may be less disruptive.
	if (order === null) {
		return null
	}

	if (order === false) {
		return (
			<p id='orderNotFound'>
				Sorry, this order either does not exist or it was not placed by the user you are logged in as.
			</p>
		)
	}

	return (
		<div id='orderDetailsContent'>
			<ul>
				<li>
					<strong>Order ID:</strong> {order.orderId}
				</li>
				<li className={accountStyles.addresses}>
					<div>
						<strong>Billing Address:</strong>
						<ul className={accountStyles.address}>
							{!!order.businessName && <li>{order.businessName}</li>}
							<li>{order.fullName}</li>
							<li>{order.billingAddress.line1}</li>
							{!!order.billingAddress?.line2 && <li>{order.billingAddress.line2}</li>}
							<li>{order.billingAddress.city}</li>
							{!!order.billingAddress?.state && <li>{order.billingAddress.state}</li>}
							<li>{order.billingAddress.postal_code}</li>
							<li>{countryCodeToName(order.billingAddress.country)}</li>
						</ul>
					</div>
					{order.isShipping && !!order?.shippingAddress && (
						<div>
							<strong>Shipping Address:</strong>
							<ul className={accountStyles.address}>
								{order.shippingAddress?.name ? (
									<li>{order.shippingAddress.name}</li>
								) : (
									<>
										{!!order.businessName && <li>{order.businessName}</li>}
										<li>{order.fullName}</li>
									</>
								)}
								<li>{order.shippingAddress.line1}</li>
								{!!order.shippingAddress?.line2 && <li>{order.shippingAddress.line2}</li>}
								<li>{order.shippingAddress.city}</li>
								{!!order.shippingAddress?.state && <li>{order.shippingAddress.state}</li>}
								<li>{order.shippingAddress.postal_code}</li>
								<li>{countryCodeToName(order.shippingAddress.country)}</li>
							</ul>
						</div>
					)}
				</li>
			</ul>
		</div>
	)
}

export default OrderDetails
