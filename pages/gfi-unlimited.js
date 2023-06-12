import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('UNLIMITED')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const UnlimitedLegacy = (props) => {
	const { productDataArray } = props
	console.log(productDataArray)
	return <PricingPage productIntro={<p>GFI Unlimited...</p>} productDataArray={productDataArray}></PricingPage>
}

export default UnlimitedLegacy
