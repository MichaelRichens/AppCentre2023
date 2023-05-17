import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
import asyncFetchAndProcessProducts from '../server-utils/asyncFetchAndProcessProducts'

/*
const [products, extensions, hardware] = await Promise.all([
			fetchFromProductDataCollection('products', productFamily, productOption),
			fetchFromProductDataCollection('extensions', productFamily, productOption),
			fetchFromProductDataCollection('hardware', productFamily, productOption),
		])
	*/

export async function getStaticProps() {
	const productDataArray = await Promise.all([
		asyncFetchAndProcessProducts('HELPDESK', 'CASE'),
		asyncFetchAndProcessProducts('HELPDESK', 'FUSION'),
	])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const HelpDeskPricing = (props) => {
	const { productDataArray } = props

	return (
		<PricingPage
			productIntro={<p>GFI HelpDesk is licenced on a per-user yearly subscription basis.</p>}
			productFamily={'HELPDESK'}
			productDataArray={productDataArray}
			unitName={new Word('user', 'users')}></PricingPage>
	)
}

export default HelpDeskPricing
