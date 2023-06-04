import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onSnapshot, collection, where, query, getDocs, doc } from 'firebase/firestore'
import withAuth from '../../components/hoc/withAuth'
import { useAuth } from '../../components/contexts/AuthContext'
import Page from '../../components/page/Page'
import LoadingPage from '../../components/page/LoadingPage'
import { firestore } from '../../utils/firebaseClient'

const Order = () => {
	const { user } = useAuth()
	const router = useRouter()
	const { orderId } = router.query
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
				throw new Error(`Expected 1 document, found ${querySnapshot.size}`)
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
				console.error(error)
			})
		}

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [orderId])

	if (orderId === undefined) {
		return <LoadingPage />
	}

	return <Page>{orderId}</Page>
}

export default withAuth(Order)
