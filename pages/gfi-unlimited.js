import React from 'react'
import Link from 'next/link'
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

	return (
		<PricingPage
			subHeading='Legacy Product (Renewals Only)'
			productIntro={
				<>
					<p>
						GFI Unlimited was a software bundle offered by GFI that allowed access to a wide range of their software
						with a single subscription. This bundle is no longer a current product, and while existing customers can
						continue to renew their subscription with their current users, additional users cannot be added. New
						subscriptions are not available.
					</p>
					<p>
						If you need additional users, the only option is to migrate the GFI Unlimited subscription into separate
						subscriptions for the individual products that you use. Please <Link href='/contact'>contact us</Link> if
						you need to go this route and we can assist you.
					</p>
				</>
			}
			productDataArray={productDataArray}></PricingPage>
	)
}

export default UnlimitedLegacy
