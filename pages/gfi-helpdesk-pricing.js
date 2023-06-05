import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('HELPDESK', ['CASE', 'FUSION'])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const HelpDeskPricing = (props) => {
	const { productDataArray } = props

	return (
		<PricingPage
			productIntro={<p>GFI HelpDesk is licenced on a per-user yearly subscription basis.</p>}
			productDataArray={productDataArray}
			logoSrc='/images/logos/gfi-helpdesk-logo.svg'></PricingPage>
	)
}

export default HelpDeskPricing
