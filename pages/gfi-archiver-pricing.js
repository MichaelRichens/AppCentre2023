import React from 'react'
import Link from 'next/link'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('ARCHIVER')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ArchiverPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={<p>GFI Archiver is licenced on a per-mailbox yearly subscription basis.</p>}
			productDataArray={productDataArray}
			logoSrc='/images/logos/gfi-archiver-logo.svg'>
			<section className='text'>
				<p>
					For more information about how licencing works in GFI Archiver, see{' '}
					<Link href='https://support.archiver.gfi.com/hc/en-us/articles/360015209180-Licensing-in-Archiver'>
						this article
					</Link>
					.
				</p>
			</section>
		</PricingPage>
	)
}

export default ArchiverPricing
