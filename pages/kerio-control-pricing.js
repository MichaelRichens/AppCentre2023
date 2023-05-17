import React from 'react'
import PricingPage from '../components/PricingPage'
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
		<PricingPage
			productIntro={<p>Kerio Control is licenced on a per-user yearly subscription basis.</p>}
			productFamily={'CONTROL'}
			productData={productData}
			unitName={new Word('user', 'users')}></PricingPage>
	)
}

export default ControlPricing
