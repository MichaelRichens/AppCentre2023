import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { useAuth } from '/components/contexts/AuthContext'
import { firestore } from '/utils/firebaseClient'

import { ordersSnapshotListener } from '/utils/ordersDisplay'

import accountStyles from '/styles/Account.shared.module.css'

/**
 * Displays all orders placed
 * Should only be used on pages served by withAdminAuth HOC
 * (Firestore orders table will also require an admin user to serve documents)
 */
const AdminOrders = ({}) => {
	const { user, isAuthLoading, asyncIsUserAdmin } = useAuth()
	// isUserAdmin starts as null, and is set to true or false once it has been determined
	const [isUserAdmin, setIsUserAdmin] = useState(null)
	const [orders, setOrders] = useState(null)
	const [limitOrdersShown, setLimitOrdersShown] = useState(true)

	useEffect(() => {
		if (isAuthLoading || !user) {
			return
		}
		setIsUserAdmin(asyncIsUserAdmin())
	}, [user, isAuthLoading])

	useEffect(() => {
		if (!isUserAdmin) {
			return
		}

		// Create a reference to the  orders collection.
		const orderDocRef = collection(firestore, 'orders')

		// And set up a listener on that reference
		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			ordersSnapshotListener(querySnapshot, setOrders, true)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [isUserAdmin])

	if (isUserAdmin === null) {
		return <p>Loading...</p>
	}

	if (isUserAdmin === false) {
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

	return <p>No orders found.</p>
}

export default AdminOrders
