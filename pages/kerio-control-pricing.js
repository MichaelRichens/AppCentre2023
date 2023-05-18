import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONTROL')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ControlPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>Kerio Control is licenced on a per-user yearly subscription basis.</p>}
			productFamily={'CONTROL'}
			productDataArray={productDataArray}
			unitName={new Word('user', 'users')}></PricingPage>
	)
}

export default ControlPricing
