import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONNECT')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ConnectPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			logoSrc='/images/logos/kerio-connect-logo.svg'
			productIntro={<p>Kerio Connect is licenced on a per-user yearly subscription basis, with optional extensions.</p>}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default ConnectPricing
