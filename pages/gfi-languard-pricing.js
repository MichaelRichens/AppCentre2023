import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts('LANGUARD')

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const LanGuardPricing = (props) => {
	const { productData } = props
	return (
		<PricingPage
			productIntro={<p>GFI Languard is licenced on a per-node yearly subscription basis.</p>}
			productFamily={'LANGUARD'}
			productDataArray={[productData]}
			unitName={new Word('node', 'nodes')}></PricingPage>
	)
}

export default LanGuardPricing
