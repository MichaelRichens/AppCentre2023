import React from 'react'
import { useRouter } from 'next/router'
import withAuth from '/components/hoc/withAuth'
import Page from '/components/page/Page'
import LoadingPage from '/components/page/LoadingPage'
import OrderDetails from '/components/account/OrderDetails'

import accountStyles from '/styles/Account.shared.module.css'

const Order = () => {
	const router = useRouter()
	const { orderId } = router.query

	if (!orderId === null) {
		return <LoadingPage />
	}

	return (
		<Page mainClassName={accountStyles.accountDetailsPage} title='Order Details'>
			<section>
				<OrderDetails orderId={orderId} />
			</section>
		</Page>
	)
}

export default withAuth(Order)
