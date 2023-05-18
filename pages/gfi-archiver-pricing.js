import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('ARCHIVER')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ArchiverPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>GFI Archiver is licenced on a per-mailbox yearly subscription basis.</p>}
			productFamily={'ARCHIVER'}
			productDataArray={productDataArray}
			unitName={new Word('mailbox', 'mailboxes')}></PricingPage>
	)
}

export default ArchiverPricing
