import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import withAuth from '../../components/hoc/withAuth'
import Page from '../../components/page/Page'
import LoadingPage from '../../components/page/LoadingPage'

const Order = () => {
	const router = useRouter()
	const { orderId } = router.query

	useEffect(() => {
		console.log(orderId)
	}, [orderId])

	if (orderId === undefined) {
		return <LoadingPage />
	}

	return <Page>{orderId}</Page>
}

export default withAuth(Order)
