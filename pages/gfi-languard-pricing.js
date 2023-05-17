import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
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
		<SubscriptionPage
			productIntro={<p>GFI Languard is licenced on a per-node yearly subscription basis.</p>}
			productFamily={'LANGUARD'}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('node', 'nodes')}></SubscriptionPage>
	)
}

export default LanGuardPricing
