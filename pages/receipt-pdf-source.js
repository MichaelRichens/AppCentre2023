import React from 'react'
import { useRouter } from 'next/router'
import withAuth from '/components/hoc/withAuth'
import OrderDetails from '/components/account/OrderDetails'

import accountStyles from '/styles/Account.shared.module.css'

const ReceiptPdfSource = () => {
	const router = useRouter()
	const { orderId } = router.query

	if (!orderId === null) {
		return null
	}

	return <OrderDetails orderId={orderId} />
}

export default withAuth(ReceiptPdfSource)
