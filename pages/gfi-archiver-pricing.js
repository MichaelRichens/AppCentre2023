import React from 'react'
import PricingPage from '../components/PricingPage'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts('ARCHIVER')

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ArchiverPricing = (props) => {
	const { productData } = props
	return (
		<PricingPage
			productIntro={<p>GFI Archiver is licenced on a per-mailbox yearly subscription basis.</p>}
			productFamily={'ARCHIVER'}
			productDataArray={[productData]}
			unitName={new Word('mailbox', 'mailboxes')}></PricingPage>
	)
}

export default ArchiverPricing
