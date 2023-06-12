import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('UNLIMITED')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const UnlimitedLegacy = (props) => {
	const { productDataArray } = props
	console.log(productDataArray)
	return (
		<PricingPage
			subHeading='Legacy Product (Renewals Only)'
			productIntro={
				<p>
					GFI Unlimited was a software bundle offered by GFI that allowed access to a wide range of their software with
					a single subscription. This bundle is no longer a current product, and while existing customers can renew
					their current users, additional users cannot be added, and new subscriptions are not available.
				</p>
			}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default UnlimitedLegacy
