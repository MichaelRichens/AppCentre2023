import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts('CONNECT')

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ConnectPricing = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productIntro={<p>Kerio Connect is licenced on a per-user yearly subscription basis.</p>}
			productFamily={'CONNECT'}
			productData={productData}
			unitName={new Word('user', 'users')}></SubscriptionPage>
	)
}

export default ConnectPricing
