import React from 'react'
import Link from 'next/link'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('MAILESSENTIALS', [
		'ANTISPAM',
		'EMAILSECURITY',
		'UNIFIEDPROTECTION',
	])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
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
			logoSrc='/images/logos/gfi-mailessentials-logo.svg'
			productDataArray={productDataArray}>
			<section className='text'>
				<p>
					For information on how MailEssentials counts mailboxes for licensing purposes, see{' '}
					<Link href='https://support.mailessentials.gfi.com/hc/en-us/articles/360015139839-How-does-MailEssentials-Retrieve-and-Count-Users-'>
						this article
					</Link>
					.
				</p>
			</section>
		</PricingPage>
	)
}

export default MailEssentialsPricing
