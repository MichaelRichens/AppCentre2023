import React from 'react'
import PricingPage from '../components/PricingPage'
import createUnitName from '../utils/createUnitName'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONNECT')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ConnectPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>Kerio Connect is licenced on a per-user yearly subscription basis.</p>}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default ConnectPricing
