import React from 'react'
import PricingPage from '../components/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('LANGUARD')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const LanGuardPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>GFI Languard is licenced on a per-node yearly subscription basis.</p>}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default LanGuardPricing
