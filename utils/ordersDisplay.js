import Link from 'next/link'
import TableData from '/utils/types/TableData'
import { OrderStatusDisplay, OrderStatusDisplayAdmin, isCompleteOrder } from '/utils/types/enums/OrderStatus'
import getOrderPrice from '/utils/getOrderPrice'

// Helper function for the ordersSnapshotListener functions - creates the order object with data from orderData which is common between the customer and admin
// versions. Ie this is for shared logic.
function getSharedOrderData(orderData) {
	// The data we want to display for this order goes here, formatted for user display
	const order = {}

	// id
	order.orderId = orderData.orderId

	order.status = orderData.status

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
	order.priceEx = orderPrice.priceExFormatted
	order.priceInc = orderPrice.priceIncFormatted

	return order
}

// Helper function for creating the TableData instance in both the customer and admin ordersSnapshotListener
// The isAdmin boolean can be set to true to show admin only data (this is all client side and not truly secure, but actual data will only be visible to admin users with the correct firebase permissions to see it)
function sharedCreateTable(ordersArray, isAdmin) {
	if (ordersArray?.length < 1) {
		return null
	}

	// Sort the orders into most recent first
	ordersArray.sort((a, b) => b.sortOrder - a.sortOrder)

	// And create a TableData instance from them
	// NOTE: Styles are applied to this table by column position, so need to update Account.shared.module.css .orderHistoryTable when changing column layout
	const columns = ['Order', 'Name', 'Price Ex Vat', 'Price Inc Vat', 'Status']
	const rows = ordersArray.map((order) => order.date)
	const tableData = new TableData(rows, columns, 'Date')

	ordersArray.forEach((order) => {
		tableData.setData(
			order.date,
			'Order',
			<>
				{isCompleteOrder(order.status) ? <Link href={'/order/' + order.orderId}>{order.orderId}</Link> : order.orderId}
				{isAdmin && (
					<>
						<br />
						<Link href={'/admin/order/' + order.orderId}>{order.orderId}</Link>{' '}
					</>
				)}
			</>
		)
		tableData.setData(order.date, 'Name', order.name || '')
		tableData.setData(order.date, 'Price Ex Vat', order.priceEx || '')
		tableData.setData(order.date, 'Price Inc Vat', order.priceInc || '')
		tableData.setData(order.date, 'Status', order.displayStatus || '')
	})
	return tableData
}

/**
 * For displaying orders to the customer.  Iterates over a Firestore snapshot of orders, formats the data for each order,
 * and updates the state with a TableData instance of the orders.
 * This does not filter out orders with unwanted statuses (ie expired) - the caller is expected to handle that in the query.
 *
 * @export
 * @param {firebase.firestore.QuerySnapshot} ordersQuerySnapshot - The Firestore snapshot of orders to process.
 * @param {Function} setOrdersState - A state setter function to update the state with the processed orders.
 */
export function customerOrdersSnapshotListener(ordersQuerySnapshot, setOrdersState) {
	const ordersArray = []
	ordersQuerySnapshot.forEach((doc) => {
		if (doc.exists) {
			const orderData = doc.data()

			const order = getSharedOrderData(orderData)

			order.displayStatus = OrderStatusDisplay(orderData.status)

			// Customers only get links to complete orders
			order.generateLink = isCompleteOrder(orderData.status)

			ordersArray.push(order)
		}
	})

	setOrdersState(sharedCreateTable(ordersArray, false))
}

/**
 * For displaying orders to an administrator.  Iterates over a Firestore snapshot of orders, formats the data for each order,
 * and updates the state with a TableData instance of the orders.
 *
 * @export
 * @param {firebase.firestore.QuerySnapshot} ordersQuerySnapshot - The Firestore snapshot of orders to process.
 * @param {Function} setOrdersState - A state setter function to update the state with the processed orders.
 */
export function adminOrdersSnapshotListener(ordersQuerySnapshot, setOrdersState) {
	const ordersArray = []
	ordersQuerySnapshot.forEach((doc) => {
		if (doc.exists) {
			const orderData = doc.data()

			const order = getSharedOrderData(orderData)

			const basicStatus = OrderStatusDisplay(orderData.status)
			const adminStatus = OrderStatusDisplayAdmin(orderData.status)

			order.displayStatus = (
				<>
					{basicStatus}
					{basicStatus !== adminStatus && (
						<>
							<br />({adminStatus})
						</>
					)}
				</>
			)

			order.generateLink = true

			ordersArray.push(order)
		}
	})

	setOrdersState(sharedCreateTable(ordersArray, true))
}
