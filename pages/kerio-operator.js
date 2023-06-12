import React from 'react'
import Link from 'next/link'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('OPERATOR')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const OperatorLegacy = (props) => {
	const { productDataArray } = props

	return (
		<PricingPage
			subHeading='Legacy Product (Existing Customers Only)'
			productIntro={
				<>
					<p>
						Kerio Operator is a VoIP-based phone system focused on usability and security. The product is now
						discontinued, but existing customers are supported and can purchase continuing subscriptions and additional
						users. New purchases are not available.
					</p>
				</>
			}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default OperatorLegacy
