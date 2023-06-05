import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('ARCHIVER')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ArchiverPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>GFI Archiver is licenced on a per-mailbox yearly subscription basis.</p>}
			productDataArray={productDataArray}
			logoSrc='/images/logos/gfi-archiver-logo.svg'></PricingPage>
	)
}

export default ArchiverPricing
