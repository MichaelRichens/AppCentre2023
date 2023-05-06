import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_ARCHIVER)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const Archiver = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='GFI Archiver'
			productIntro={<p>GFI Archiver is etc.</p>}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_ARCHIVER}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('mailbox', 'mailboxes')}></SubscriptionPage>
	)
}

export default Archiver
