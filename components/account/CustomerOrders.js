import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { useAuth } from '/components/contexts/AuthContext'
import { OrderStatus } from '/utils/types/enums/OrderStatus'
import { firestore } from '/utils/firebaseClient'
import { customerOrdersSnapshotListener } from '/utils/ordersDisplay'

import accountStyles from '/styles/Account.shared.module.css'

/**
 * Displays the orders for the current logged in firebase user.
 * Should only be used on pages served by withAuth HOC
 */
const CustomerOrders = ({}) => {
	const { user, isAuthLoading } = useAuth()

	const [orders, setOrders] = useState(null)
	const [limitOrdersShown, setLimitOrdersShown] = useState(true)

	useEffect(() => {
		if (!user || isAuthLoading) {
			return
		}

		// Create a reference to the user's documents in the orders collection.
		const unwantedStatuses = [OrderStatus.EXPIRED, OrderStatus.UPDATE_ERROR]
		const orderDocRef = query(
			collection(firestore, 'orders'),
			where('firebaseUserId', '==', user.uid),
			where('status', 'not-in', unwantedStatuses)
		)

		// And set up a listener on that reference
		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			customerOrdersSnapshotListener(querySnapshot, setOrders)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [user, isAuthLoading])

	if (!user || isAuthLoading) {
		return null
	}

	if (orders) {
		return (
			<>
				<table className={accountStyles.orderHistoryTable}>
					<caption>{orders.rows.length > 5 ? (limitOrdersShown ? 'Last 5 Orders' : 'All Orders') : 'Orders'}</caption>
					{orders.generate(limitOrdersShown ? 5 : false)}
				</table>
				{orders.rows.length > 5 && (
					<button type='button' onClick={() => setLimitOrdersShown(!limitOrdersShown)}>{`${
						limitOrdersShown ? 'Show All' : 'Show Less'
					} Orders`}</button>
				)}
			</>
		)
	}
	return <p>No orders yet!</p>
}

export default CustomerOrders
