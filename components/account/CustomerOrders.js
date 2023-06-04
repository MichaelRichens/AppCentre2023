import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import SimpleTable from '../SimpleTable'
import { firestore } from '../../utils/firebaseClient'
import TableData from '../../utils/types/TableData'
import { OrderStatus, OrderStatusDisplay } from '../../utils/types/enums/OrderStatus'
import { formatPriceFromPounds } from '../../utils/formatPrice'
import getOrderPrice from '../../utils/getOrderPrice'

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
					order.date = `${date.toLocaleDateString()} ${date.toLocaleTimeString(undefined, {
						hour: '2-digit',
						minute: '2-digit',
					})}`
					// Date for sorting
					order.sortOrder = date

					let name
					if (orderData?.businessName) {
						name = `${orderData.businessName} - ${orderData?.fullName}`
					} else {
						name = orderData?.fullName
					}
					order.name = name

					// Price - always use this function for prices
					const orderPrice = getOrderPrice(orderData)
					order.priceEx = formatPriceFromPounds(orderPrice.priceEx, false) // Not using priceExFormatted because I don't want the '+ vat' text
					order.priceInc = orderPrice.priceIncFormatted

					order.status = OrderStatusDisplay(orderData.status)

					ordersArray.push(order)
				}
			})

			// Sort the orders into most recent first
			ordersArray.sort((a, b) => b.sortOrder - a.sortOrder)

			// And create a TableData instance from them
			const columns = ['Name', 'Price Ex Vat', 'Price Inc Vat', 'Status']
			const rows = ordersArray.map((order) => order.date)
			const tableData = new TableData(rows, columns, 'Date')
			ordersArray.forEach((order) => {
				tableData.setData(order.date, 'Name', order.name || '')
				tableData.setData(order.date, 'Price Ex Vat', order.priceEx || '')
				tableData.setData(order.date, 'Price Inc Vat', order.priceInc || '')
				tableData.setData(order.date, 'Status', order.status || '')
			})

			setOrders(ordersArray.length ? tableData : null)
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
				<table>
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
