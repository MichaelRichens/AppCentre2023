import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts('CONTROL')

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ControlPricing = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productIntro={<p>Kerio Control is licenced on a per-user yearly subscription basis.</p>}
			productFamily={'CONTROL'}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('user', 'users')}></SubscriptionPage>
	)
}

export default ControlPricing
