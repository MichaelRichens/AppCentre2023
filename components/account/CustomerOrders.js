import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { useAuth } from '/components/contexts/AuthContext'
import useQueryStringPagination from '/components/hooks/useQueryStringPagination'
import { OrderStatus, isCompleteOrder } from '/utils/types/enums/OrderStatus'
import { firestore } from '/utils/firebaseClient'
import { customerOrdersSnapshotListener } from '/utils/ordersDisplay'
import PaginationControl from '/components/PaginationControl'

import accountStyles from '/styles/Account.shared.module.css'

/**
 * Displays the orders for the current logged in firebase user.
 * Should only be used on pages served by withAuth HOC
 */
const CustomerOrders = ({}) => {
	const { user, isAuthLoading } = useAuth()
	const qsHook = useQueryStringPagination(0, process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_DEFAULT_PAGE_SIZE)
	const [pageStart, pageSize] = qsHook

	const [orders, setOrders] = useState(null)

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

	let pageEnd = pageStart + pageSize
	if (pageEnd >= orders?.length) {
		pageEnd = orders.length > 0 ? orders.length - 1 : 0
	}

	if (!user || isAuthLoading) {
		return null
	}

	if (orders) {
		let caption = 'Orders'
		if (orders.length > process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_DEFAULT_PAGE_SIZE) {
			caption += ` (${pageStart + 1} - ${pageEnd})`
		}

		return (
			<>
				{orders.length > process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_DEFAULT_PAGE_SIZE && (
					<PaginationControl totalSize={orders.length} qsHook={qsHook} />
				)}
				<table className={accountStyles.orderHistoryTable}>
					<caption>{caption}</caption>
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
									{isCompleteOrder(order.status) ? (
										<Link href={'/order/' + order.orderId}>{order.orderId}</Link>
									) : (
										order.orderId
									)}
								</td>
								<td className={accountStyles.name}>{order.name}</td>
								<td className={accountStyles.price}>{order.priceEx}</td>
								<td className={accountStyles.price}>{order.priceInc}</td>
								<td className={accountStyles.status}>{order.displayStatus}</td>
							</tr>
						))}
					</tbody>
				</table>
				{orders.length > process.env.NEXT_PUBLIC_CUSTOMER_ORDERS_DEFAULT_PAGE_SIZE && (
					<PaginationControl totalSize={orders.length} qsHook={qsHook} />
				)}
			</>
		)
	}
	return <p>No orders yet!</p>
}

export default CustomerOrders
