import Link from 'next/link'
import TableData from '/utils/types/TableData'
import { OrderStatusDisplay, OrderStatusDisplayAdmin, isCompleteOrder } from '/utils/types/enums/OrderStatus'
import getOrderPrice from '/utils/getOrderPrice'

/**
 * Iterates over a Firestore snapshot of orders, formats the data for each order,
 * and updates the state with a TableData instance of the orders.
 *
 * @export
 * @param {firebase.firestore.QuerySnapshot} ordersQuerySnapshot - The Firestore snapshot of orders to process.
 * @param {Function} setOrdersState - A state setter function to update the state with the processed orders.
 * @param {boolean} [isAdmin=false] - Optionally can pass `true` to have the listener configure itself for use with admin component - more details to order status, links to admin order pages not customer ones
 */
export function ordersSnapshotListener(ordersQuerySnapshot, setOrdersState, isAdmin = false) {
	// Iterate the snapshot orders and pull their order details into an array
	const ordersArray = []
	ordersQuerySnapshot.forEach((doc) => {
		if (doc.exists) {
			const orderData = doc.data()

			// The data we want to display for this order goes here, formatted for user display
			const order = {}

			// id
			order.orderId = orderData.orderId

			// For customers, we only provide a link to the order details page for orders with some kind of completed status
			order.generateLink = isAdmin || isCompleteOrder(orderData.status)

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

			if (!isAdmin || OrderStatusDisplay(orderData.status) === OrderStatusDisplayAdmin(orderData.status)) {
				order.status = OrderStatusDisplay(orderData.status)
			} else {
				order.status = (
					<>
						{OrderStatusDisplay(orderData.status)}
						<br />({OrderStatusDisplayAdmin(orderData.status)})
					</>
				)
			}

			ordersArray.push(order)
		}
	})

	let orderPath = isAdmin ? '/admin/order/' : '/order/'

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
			(order.generateLink ? <Link href={orderPath + order.orderId}>{order.orderId}</Link> : order.orderId) || ''
		)
		tableData.setData(order.date, 'Name', order.name || '')
		tableData.setData(order.date, 'Price Ex Vat', order.priceEx || '')
		tableData.setData(order.date, 'Price Inc Vat', order.priceInc || '')
		tableData.setData(order.date, 'Status', order.status || '')
	})

	setOrdersState(ordersArray.length ? tableData : null)
}
