import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseClient'
import ProductConfiguration from '../../utils/types/ProductConfiguration'
import { formatPriceFromPounds } from '../../utils/formatPrice'

import accountStyles from '../../styles/Account.shared.module.css'

/**
 * Displays the orders for the passed in firebase user object.
 * Should only be used on pages served by withAuth HOC
 */
const CustomerOrders = ({ user }) => {
	const [orders, setOrders] = useState([])
	const [limitOrdersShown, setLimitOrdersShown] = useState(true)

	useEffect(() => {
		const orderDocRef = query(collection(firestore, 'orders'), where('firebaseUserId', '==', user.uid))

		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			const data = []
			querySnapshot.forEach((doc) => {
				if (doc.exists) {
					const order = doc.data()
					order.createdAt = order.createdAt.toDate()
					order.updatedAt = order.updatedAt.toDate()
					order.price = 0
					if (order.line_items) {
						for (const key in order.line_items) {
							const line = ProductConfiguration.fromRawProperties(order.line_items[key])
							order.line_items[key] = line
							order.price += line.price
						}
					}

					data.push(order)
				}
			})

			data.sort((a, b) => b.createdAt - a.createdAt)

			setOrders(data)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [user])

	if (orders.length) {
		return (
			<div className={accountStyles.orderList}>
				<ul>
					{orders.slice(0, limitOrdersShown ? 5 : orders.length).map((order) => (
						<li
							key={order.sessionId}>{`${order.createdAt.toLocaleDateString()} ${order.createdAt.toLocaleTimeString()} ${
							order.sessionId
						} ${formatPriceFromPounds(order.price)} ${order.status}`}</li>
					))}
				</ul>
				{orders.length > 5 && (
					<button type='button' onClick={() => setLimitOrdersShown(!limitOrdersShown)}>{`${
						limitOrdersShown ? 'Show All' : 'Show Less'
					} Orders`}</button>
				)}
			</div>
		)
	}
	return <p>No orders yet!</p>
}

export default CustomerOrders
