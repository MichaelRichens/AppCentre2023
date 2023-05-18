import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
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
			productFamily={'LANGUARD'}
			productDataArray={productDataArray}
			unitName={new Word('node', 'nodes')}></PricingPage>
	)
}

export default LanGuardPricing
