import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { onSnapshot, collection } from 'firebase/firestore'
import { useAuth } from '/components/contexts/AuthContext'
import useQueryStringPagination from '/components/hooks/useQueryStringPagination'
import { firestore } from '/utils/firebaseClient'
import { adminOrdersSnapshotListener } from '/utils/ordersDisplay'
import PaginationControl from '/components/PaginationControl'

import accountStyles from '/styles/Account.shared.module.css'

/**
 * Displays all orders placed
 * Should only be used on pages served by withAdminAuth HOC
 * (Firestore orders table will also require an admin user to serve documents)
 */
const AdminOrders = ({}) => {
	const { user, isAuthLoading, asyncIsUserAdmin } = useAuth()
	const qsHook = useQueryStringPagination(0, 10)
	const [pageStart, pageSize] = qsHook
	// isUserAdmin starts as null, and is set to true or false once it has been determined
	const [isUserAdmin, setIsUserAdmin] = useState(null)
	const [orders, setOrders] = useState(null)

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
			adminOrdersSnapshotListener(querySnapshot, setOrders)
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

	let pageEnd = pageStart + pageSize
	if (pageEnd >= orders?.length) {
		pageEnd = orders.length > 0 ? orders.length - 1 : 0
	}

	if (orders) {
		return (
			<>
				<PaginationControl totalSize={orders.length} qsHook={qsHook} />
				<table className={accountStyles.orderHistoryTable}>
					<caption>{`Orders (${pageStart + 1} - ${pageEnd})`}</caption>
					<thead>
						<tr>
							<th scope='col'>Date</th>
							<th scope='col'>Order ID</th>
							<th scope='col' className={accountStyles.name}>
								Customer Name
							</th>
							<th scope='col'>Price Ex Vat</th>
							<th scope='col'>Price Inc Vat</th>
							<th scope='col'>Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.slice(pageStart, pageEnd).map((order, index) => (
							/* Test data has some orders without an orderId set - the OR condition in the key should never be needed with live data */
							<tr key={order.orderId || pageStart + index}>
								<td>{order.date}</td>
								<td>
									<Link href={'/order/' + order.orderId}>{order.orderId}</Link>
									<br />
									<Link href={'/admin/order/' + order.orderId}>Admin</Link>
								</td>
								<td className={accountStyles.name}>{order.name}</td>
								<td className={accountStyles.price}>{order.priceEx}</td>
								<td className={accountStyles.price}>{order.priceInc}</td>
								<td className={accountStyles.status}>{order.displayStatus}</td>
							</tr>
						))}
					</tbody>
				</table>
				<PaginationControl totalSize={orders.length} qsHook={qsHook} />
			</>
		)
	}

	return <p>No orders found.</p>
}

export default AdminOrders
