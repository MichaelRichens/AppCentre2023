import React, { useEffect, useState } from 'react'
import { onSnapshot, collection, where, query, getDocs, doc } from 'firebase/firestore'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Modal from 'react-modal'
import { LineWave } from 'react-loader-spinner'
import { useAuth } from '/components/contexts/AuthContext'
import BusyButton from '/components/BusyButton'
import ProductConfiguration from '/utils/types/ProductConfiguration'
import { isCompleteOrder } from '/utils/types/enums/OrderStatus'
import { firestore } from '/utils/firebaseClient'
import { formatPriceFromPounds } from '/utils/formatPrice'
import getOrderPrice from '/utils/getOrderPrice'
import { countryCodeToName } from '/utils/countryLookup'

import { getModalBaseStyleObject } from '/styles/modalBaseStyleObject'
import accountStyles from '/styles/Account.shared.module.css'

const OrderDetails = ({ orderId }) => {
	const { user, anonymousUser } = useAuth()

	// Holds the details of the order looked up in firestore, or false if not found.
	// Initial state of null indicates that the lookup is in progress.
	const [order, setOrder] = useState(null)

	const [pdfReady, setPdfReady] = useState(null)
	const [generatingPdf, setGeneratingPdf] = useState(false)

	useEffect(() => {
		let unsubscribeOrders = () => {} // empty default function since this gets called in the useEffect cleanup return

		const getOrder = async () => {
			//Find the order document that matches orderId

			// reference to the collection
			const ordersRef = collection(firestore, 'orders')

			// Find the matching document
			// Doing a query by firebaseUserId first is required by the permissions that are on the orders collection
			const q = query(
				ordersRef,
				where('firebaseUserId', '==', user?.uid || anonymousUser?.uid),
				where('orderId', '==', orderId)
			)
			const querySnapshot = await getDocs(q)

			if (querySnapshot.size !== 1) {
				// if we don't find a document, this order does not exist or does not belong to this user (we literally can't tell the difference when logged in as this user)
				if (!querySnapshot.size) {
					throw new Error('NOT_FOUND')
				}
				throw new Error(`Found ${querySnapshot.size} order with the same order id - this should never happen.`)
			}

			// Get a reference to the document
			let docRef
			querySnapshot.forEach((document) => {
				docRef = document.ref
			})

			// And setup a listener on it
			unsubscribeOrders = onSnapshot(docRef, (doc) => {
				const data = doc.data()

				for (let key in data?.line_items) {
					data.line_items[key] = ProductConfiguration.fromRawProperties(data.line_items[key])
				}
				setOrder(data)
			})
		}

		// If we have an orderId, get a listener set up on the order document
		if (orderId) {
			getOrder().catch((error) => {
				// If it wasn't found, we setOrder to false, which displays a relevant page.  Other errors it will just stay in the Loading state indefinitely
				if (error.message === 'NOT_FOUND') {
					setOrder(false)
				} else {
					console.error(error)
				}
			})
		}

		// Clean up subscriptions on unmount
		return () => {
			unsubscribeOrders()
		}
	}, [orderId])

	useEffect(() => {
		const interval = setInterval(() => {
			if (document.getElementById('orderDetailsContent')) {
				setPdfReady(true)
				clearInterval(interval)
			} else if (document.getElementById('orderNotFound')) {
				setPdfReady(false)
				clearInterval(interval)
			}
		}, 200) // check every second

		// Cleanup on unmount
		return () => clearInterval(interval)
	}, [])

	const printDocument = async () => {
		try {
			const input = document.getElementById('orderDetailsContent')
			setGeneratingPdf(true)
			input.classList.add(accountStyles.pdfReceipt)
			const canvas = await html2canvas(input, { scale: 1 })
			input.classList.remove(accountStyles.pdfReceipt)
			setGeneratingPdf(false)
			const imgData = canvas.toDataURL('image/png')
			const pdf = new jsPDF()
			pdf.addImage(imgData, 'JPEG', 0, 0)
			pdf.save(`AppCentre Order - ${orderId}.pdf`)
		} catch (error) {
			setGeneratingPdf(false)
		}
	}

	const modalStyles = getModalBaseStyleObject()
	modalStyles.content.left = '20px'
	modalStyles.content.right = '20px'
	modalStyles.content.top = '20px'
	modalStyles.content.bottom = '20px'
	modalStyles.content.transform = 'initial'
	modalStyles.content.width = 'initial'

	// Lookup in progress - could use a spinner here, but the user will likely have seen one already waiting for auth to load
	// Having this component pop in may be less disruptive.
	if (order === null) {
		return null
	}

	if (order === false) {
		return (
			<p id='orderNotFound'>
				Sorry, this order either does not exist or it was not placed by the user you are logged in as.
			</p>
		)
	}

	const isReceipt = isCompleteOrder(order.status)

	const orderTotals = getOrderPrice(order)
	Object.values(order.line_items).map((line) => {
		console.log(line.summary.product)
	})
	return (
		<>
			{pdfReady !== false && (
				<BusyButton isBusy={!pdfReady || generatingPdf} onClick={printDocument}>
					Download PDF
				</BusyButton>
			)}
			<div className={accountStyles.orderDetails} id='orderDetailsContent'>
				<section className={accountStyles.receiptTitle}>
					{isReceipt ? <h2>Receipt</h2> : <h2 className={accountStyles.notReceipt}>This is Not a Receipt</h2>}
				</section>
				<section className={accountStyles.receiptHeader}>
					<div>
						<div>
							<strong>Date:</strong>{' '}
							{order.createdAt
								.toDate()
								.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</div>
						<div>
							<strong>Order ID:</strong> {order.orderId}
						</div>
					</div>
					<div className={accountStyles.logoContainer}>
						<img src='/images/logos/appcentre-logo.svg' alt='' />
					</div>
				</section>
				<section className={accountStyles.addresses}>
					<div>
						<strong>Billing Address:</strong>
						<ul className={accountStyles.address}>
							{!!order.businessName && <li>{order.businessName}</li>}
							<li>{order?.fullName}</li>
							<li>{order?.billingAddress?.line1}</li>
							{!!order.billingAddress?.line2 && <li>{order.billingAddress.line2}</li>}
							<li>{order?.billingAddress?.city}</li>
							{!!order?.billingAddress?.state && <li>{order.billingAddress.state}</li>}
							<li>{order?.billingAddress?.postal_code}</li>
							<li>{countryCodeToName(order?.billingAddress?.country)}</li>
						</ul>
					</div>
					{order.isShipping && !!order?.shippingAddress && (
						<div>
							<strong>Shipping Address:</strong>
							<ul className={accountStyles.address}>
								{order.shippingAddress?.name ? (
									<li>{order.shippingAddress.name}</li>
								) : (
									<>
										{!!order.businessName && <li>{order.businessName}</li>}
										<li>{order.fullName}</li>
									</>
								)}
								<li>{order.shippingAddress?.line1}</li>
								{!!order.shippingAddress?.line2 && <li>{order.shippingAddress.line2}</li>}
								<li>{order.shippingAddress?.city}</li>
								{!!order.shippingAddress?.state && <li>{order.shippingAddress.state}</li>}
								<li>{order.shippingAddress?.postal_code}</li>
								<li>{countryCodeToName(order.shippingAddress?.country)}</li>
							</ul>
						</div>
					)}
				</section>
				<section className={accountStyles.pricing}>
					<ul>
						{Object.entries(order?.line_items || {}).map(([key, line]) => (
							<li key={key}>
								<ul className={accountStyles.lineItem}>
									<li>{line?.description + (line?.licence.length ? ` (${line.licence})` : '')}</li>
									<li>{formatPriceFromPounds(line?.price, false)}</li>
								</ul>
							</li>
						))}
						<li className={accountStyles.subTotal}>
							<ul className={accountStyles.lineItem}>
								<li>SubTotal</li>
								<li>{orderTotals.priceExFormatted}</li>
							</ul>
						</li>
						<li className={accountStyles.subTotal}>
							<ul className={accountStyles.lineItem}>
								<li>VAT</li>
								<li>{orderTotals.taxFormatted}</li>
							</ul>
						</li>
						<li className={accountStyles.total}>
							<ul className={accountStyles.lineItem}>
								<li>Total</li>
								<li>{orderTotals.priceIncFormatted}</li>
							</ul>
						</li>
					</ul>
				</section>
				<section>
					<p>AppCentre is a part of Second Chance PC Ltd.</p>
					<p>
						Company Number: {process.env.NEXT_PUBLIC_COMPANY_NUMBER}. Registered for VAT:{' '}
						{process.env.NEXT_PUBLIC_VAT_NUMBER}.
					</p>
					<p>W: www.appcentre.co.uk E: info@appcentre.co.uk</p>
				</section>
			</div>
			{pdfReady !== false && (
				<BusyButton isBusy={!pdfReady || generatingPdf} onClick={printDocument}>
					Download PDF
				</BusyButton>
			)}
			<Modal isOpen={generatingPdf} style={modalStyles}>
				<div>
					<h1>Generating Receipt</h1>
					<LineWave width='100%' height='600' color='#4fa94d' />
				</div>
			</Modal>
		</>
	)
}

export default OrderDetails
