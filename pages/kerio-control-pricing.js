import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONTROL', ['CONTROL', 'CONTROLBOX'])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ControlPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			logoSrc='images/logos/kerio-control-logo.svg'
			productIntro={
				<p>
					Kerio Control is available as software, licenced on a per-user yearly subscription basis with optional
					extensions. And as the Control Box hardware appliance, licenced on an unlimited users yearly subscription,
					with all extensions included.
				</p>
			}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default ControlPricing
