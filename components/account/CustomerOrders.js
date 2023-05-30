import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseClient'
import ProductConfiguration from '../../utils/types/ProductConfiguration'

/**
 * Displays the orders for the passed in firebase user object.
 * Should only be used on pages served by withAuth HOC
 */
const CustomerOrders = ({ user }) => {
	const [orders, setOrders] = useState([])

	useEffect(() => {
		const orderDocRef = query(collection(firestore, 'orders'), where('firebaseUserId', '==', user.uid))

		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			const data = []
			querySnapshot.forEach((doc) => {
				if (doc.exists) {
					const order = doc.data()

					if (order.line_items) {
						for (const key in order.line_items) {
							order.line_items[key] = ProductConfiguration.fromRawProperties(order.line_items[key])
						}
					}

					data.push(order)
				}
			})

			setOrders(data)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [user])

	if (orders.length) {
		return (
			<ul>
				{orders.map((order) => (
					<li key={order.sessionId}>{`${order.sessionId} ${order.status}`}</li>
				))}
			</ul>
		)
	}
	return <p>No orders yet!</p>
}

export default CustomerOrders
