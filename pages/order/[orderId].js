import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onSnapshot, collection, where, query, getDocs, doc } from 'firebase/firestore'
import withAuth from '/components/hoc/withAuth'
import { useAuth } from '/components/contexts/AuthContext'
import Page from '/components/page/Page'
import LoadingPage from '/components/page/LoadingPage'
import { firestore } from '/utils/firebaseClient'

import accountStyles from '/styles/Account.shared.module.css'

const Order = () => {
	const { user } = useAuth()
	const router = useRouter()
	const { orderId } = router.query

	// Holds the details of the order looked up in firestore, or false if not found.
	// Initial state of null indicates that the lookup is in progress (takes a little time for router to come ready to get orderId, and then do the lookup).
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

	if (order === null) {
		return <LoadingPage />
	}

	if (order === false) {
		return (
			<Page title='Order Not Found' mainClassName={accountStyles.accountDetailsPage}>
				<section>
					<p>Sorry, either does not exist or it was not placed by the user you are logged in as.</p>
				</section>
			</Page>
		)
	}

	return <Page mainClassName={accountStyles.accountDetailsPage}>{orderId}</Page>
}

export default withAuth(Order)
