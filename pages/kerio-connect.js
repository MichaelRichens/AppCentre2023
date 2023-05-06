import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const Connect = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='Kerio Connect'
			productIntro={<p>Kerio Connect is etc.</p>}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('user', 'users')}></SubscriptionPage>
	)
}

export default Connect
