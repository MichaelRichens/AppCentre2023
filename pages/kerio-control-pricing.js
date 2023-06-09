import React from 'react'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('CONTROL', ['CONTROL', 'CONTROLBOX'])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const ControlPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			logoSrc='/images/logos/kerio-control-logo.svg'
			productIntro={
				<p>
					Kerio Control is available as software, licenced on a per-user yearly subscription basis with optional
					extensions. And as the Control Box hardware appliance, licenced on an unlimited users yearly subscription,
					with all extensions included. The Control Box can have its 1 year warranty upgraded to 3 years.
				</p>
			}
			productDataArray={productDataArray}>
			<section className='text'>
				<h2>Definition of 'User' in Kerio Control</h2>
				<p>
					A user is defined as a person who is permitted to connect to Kerio Control. Each user can connect from up to
					five different devices represented by IP addresses, including VPN clients. Guests and their devices are
					exempted from the licensing system.
				</p>
				<p>
					If a user tries to connect from more than five devices at a time, this requires an additional user license.
				</p>
				<p>Current license usage is displayed in the administration interface on the Dashboard.</p>
				<p>
					<strong>Note:</strong> Kerio Control does not limit the number of defined user accounts. However, if the
					maximum number of currently authenticated users is reached, no more users can connect.
				</p>
				<h3>Control Box Appliance</h3>
				<p>
					There is no limitation on users with the subscription purchased with a Control Box, beyond the capabilities of
					the hardware.
				</p>
				<p>All extensions are included with a Control Box subscription.</p>
			</section>
		</PricingPage>
	)
}

export default ControlPricing
