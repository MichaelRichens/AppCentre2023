// PayPalButton.js

import React, { useEffect, useRef } from 'react'
import createOrder from '../utils/createOrder' // Adjust the path if necessary

const PayPalButton = ({ configId }) => {
	const paypalRef = useRef()

	useEffect(() => {
		window.paypal
			.Buttons({
				createOrder: () => createOrder(configId),
				onApprove: (data, actions) => {
					// Capture the funds from the transaction
					return actions.order.capture().then((details) => {
						// You can show a success message to the buyer here
						console.log('Transaction completed by ' + details.payer.name.given_name)
					})
				},
				onError: (err) => {
					// Show an error message to the buyer
					console.error('Error', err)
				},
			})
			.render(paypalRef.current)
	}, [configId])

	return <div ref={paypalRef} />
}

export default PayPalButton
