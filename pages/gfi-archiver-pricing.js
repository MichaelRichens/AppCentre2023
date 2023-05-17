import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
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
		<SubscriptionPage
			productIntro={<p>GFI Archiver is licenced on a per-mailbox yearly subscription basis.</p>}
			productFamily={'ARCHIVER'}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('mailbox', 'mailboxes')}></SubscriptionPage>
	)
}

export default ArchiverPricing
