import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONNECT')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ConnectPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			logoSrc='/images/logos/kerio-connect-logo.svg'
			productIntro={<p>Kerio Connect is licenced on a per-user yearly subscription basis, with optional extensions.</p>}
			productDataArray={productDataArray}>
			<section className='text'>
				<h2>Definition of 'User' in Kerio Connect</h2>
				<p>
					Licenses are counted by number of users. Number of users means the number of mailboxes or accounts that are:
				</p>
				<ul>
					<li>Created and enabled in Kerio Connect</li>
					<li>Mapped from a directory service. All users created in this database are count as licenses.</li>
					<li>Imported from a domain</li>
				</ul>
				<p>The following don't count as licenses:</p>
				<ul>
					<li>Disabled accounts</li>
					<li>Mailing lists</li>
					<li>Resources</li>
					<li>Aliases</li>
					<li>Domains</li>
					<li>Internal administrator account</li>
				</ul>
				<p>
					The Kerio Connect Administration interface displays information on the number of users you have and the number
					of licenses you hold.
				</p>

				<p>
					Go to <strong>Status &gt; Dashboard</strong> and view the <strong>License Details</strong> tile.
				</p>
			</section>
		</PricingPage>
	)
}

export default ConnectPricing
