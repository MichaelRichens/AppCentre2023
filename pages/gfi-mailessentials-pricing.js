import React from 'react'
import PricingPage from '../components/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('MAILESSENTIALS', [
		'ANTISPAM',
		'EMAILSECURITY',
		'UNIFIEDPROTECTION',
	])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const MailEssentialsPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={
				<p>
					GFI MailEssentials has {productDataArray.length} editions, and is licenced on a per-mailbox yearly
					subscription basis with optional extensions.
				</p>
			}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default MailEssentialsPricing
