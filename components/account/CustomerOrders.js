import React, { useState, useEffect } from 'react'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { firestore } from '../../utils/firebaseClient'
import TableData from '../../utils/types/TableData'
import { OrderStatus, OrderStatusDisplay } from '../../utils/types/enums/OrderStatus'
import { formatPriceFromPounds } from '../../utils/formatPrice'
import getOrderPrice from '../../utils/getOrderPrice'

import accountStyles from '../../styles/Account.shared.module.css'

/**
 * Displays the orders for the passed in firebase user object.
 * Should only be used on pages served by withAuth HOC
 */
const CustomerOrders = ({ user }) => {
	const [orders, setOrders] = useState(null)
	const [limitOrdersShown, setLimitOrdersShown] = useState(true)

	useEffect(() => {
		// Create a reference to the user's documents in the orders collection.
		const orderDocRef = query(collection(firestore, 'orders'), where('firebaseUserId', '==', user.uid))

		// And set up a listener on that reference
		const unsubscribeOrders = onSnapshot(orderDocRef, (querySnapshot) => {
			// Any time it changes, iterate their orders and pull their order details into an array
			const ordersArray = []
			querySnapshot.forEach((doc) => {
				if (doc.exists) {
					const orderData = doc.data()
					// Skip orders with an expired (checkout never completed) or error status
					if (orderData.status === OrderStatus.EXPIRED || orderData.status === OrderStatus.UPDATE_ERROR) {
						return // Basically a continue statement, will skip to the next iteration of the forEach
					}

					// The data we want to display for this order goes here, formatted for user display
					const order = {}

					// Date/time placed
					const date = orderData.createdAt.toDate()
					// Date for display
					order.date = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
					// Date for sorting
					order.sortOrder = date

					// Price - always use this function for prices
					const orderPrice = getOrderPrice(orderData)
					order.priceEx = orderPrice.priceExFormatted
					order.priceInc = formatPriceFromPounds(orderData.priceIncFormatted)

					order.status = OrderStatusDisplay(orderData.status)

					ordersArray.push(order)
				}
			})

			// Sort the orders into most recent first
			ordersArray.sort((a, b) => b.sortOrder - a.sortOrder)

			// And create a TableData instance from them
			const columns = ['Name', 'Price Ex', 'Price Inc', 'Status']
			const rows = ordersArray.map((order) => order.date)
			const tableData = new TableData(rows, columns, 'Date')
			ordersArray.forEach((order, index) => {
				let name
				if (order?.businessName) {
					name += `${order.businessName} - ${order.fullName}`
				} else {
					name = order.fullName
				}
				tableData.setData(order.date, 'Name', name || '')
				tableData.setData(order.date, 'Price Ex', order.priceEx || '')
				tableData.setData(order.date, 'Price Inc', order.priceInc || '')
				tableData.setData(order.date, 'Status', order.status || '')
			})

			setOrders(ordersArray.length ? tableData : null)
		})

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [user])

	if (orders) {
		return (
			<table>
				{orders.generate(limitOrdersShown ? 5 : false)}

				{orders.length > 5 && (
					<button type='button' onClick={() => setLimitOrdersShown(!limitOrdersShown)}>{`${
						limitOrdersShown ? 'Show All' : 'Show Less'
					} Orders`}</button>
				)}
			</table>
		)
	}
	return <p>No orders yet!</p>
}

export default CustomerOrders
