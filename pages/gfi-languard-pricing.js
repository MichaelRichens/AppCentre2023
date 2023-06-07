import React from 'react'
import { Link, animateScroll as scroll } from 'react-scroll'
import PricingPage from '../components/page/PricingPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('LANGUARD')

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const LanGuardPricing = (props) => {
	const { productDataArray } = props
	return (
		<PricingPage
			productIntro={
				<p>
					GFI Languard is licenced on a per-node yearly subscription basis. See{' '}
					<Link className='linkSub' to='nodeDefinition' smooth={true} duration={300}>
						below
					</Link>{' '}
					for details of what counts as a node.
				</p>
			}
			productDataArray={productDataArray}
			logoSrc='/images/logos/gfi-languard-logo.svg'>
			<section id='nodeDefinition'>
				<h2>What is and what is not a Node?</h2>
				<p>
					For the purposes of a GFI LanGuard subscription, a node is defined as a device with an active/assigned IP
					address. The IP address, MAC address, and hostname are used to identify each node. A computer is counted
					towards the license when either:
				</p>
				<ol>
					<li>A machine is scanned.</li>
					<li>An agent is deployed to a machine.</li>
					<li>A scan for a machine is imported from XML.</li>
				</ol>
				<p>
					<strong>
						If two out of the three identification methods match, it is considered the same device and will not consume
						any additional licenses.
					</strong>
				</p>
				<p>
					The first action above is performing an actual GFI LanGuard scanning towards a target computer. This means
					that a simple network discovery will not affect the license count. It is a Windows setting that affects
					whether your computer can see (find) other computers and devices on the network and whether other computers on
					the network can see your computer, and does not imply that each new machine that is discovered is using the
					license. It only adds the new computers to the dashboard.
				</p>
			</section>
		</PricingPage>
	)
}

export default LanGuardPricing
