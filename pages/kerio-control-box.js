import React from 'react'
import Page from '/components/page/Page'
import Configurator from '../components/configurator/Configurator'
import PricingTableAppliances from '../components/PricingTableAppliances'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'

import specStyles from '/styles/Specifications.shared.module.css'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('CONTROL', ['CONTROLBOX'])

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.NEXT_PUBLIC_PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const ControlBox = (props) => {
	const { productDataArray } = props
	const productData = productDataArray[0]
	return (
		<Page title='Kerio Control Box' subHeading='Hardware Appliance' mainClassName={specStyles.specPage}>
			<section className={specStyles.text}>
				<p>
					In addition to the popular Kerio Control software subscriptions, we also provide various versions of the Kerio
					Control Box hardware appliances. Rather than being licenced on a per-user basis, these appliances are licenced
					on a per-box basis with no user limits beyond the capabilities of the hardware.
				</p>
				<p>
					The hardware appliances are designed to meet high standards of performance and quality, each tailored to fit
					different networking environments.
				</p>
				<ul>
					<li>NG110 - perfect for small businesses, remote and home offices, yachts</li>
					<li>NG310 - the choice for small businesses planning for growth</li>
					<li>NG510/NG511 - ideal for mid-sized businesses</li>
				</ul>
				<p>
					The detailed specifications for each model are laid out in the table below, covering everything from processor
					type and memory to cooling solutions, firewall throughput, and power input. Physical attributes such as weight
					and dimensions are also included to assist you in selecting the right fit for your infrastructure.
				</p>
				<p>
					The Kerio Control Box appliances provide an excellent solution for those looking to enhance their network's
					reliability, security, and overall performance.
				</p>
				.
			</section>
			<section>
				<h2>Control Box Specifications</h2>
				<table className={specStyles.specifications}>
					<caption>Current Models</caption>
					<thead>
						<tr>
							<th scope='col'></th>
							<th scope='col'>NG110</th>
							<th scope='col'>NG310</th>
							<th scope='col'>NG510</th>
							<th scope='col'>NG511</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope='row'>Processor</th>
							<td>Intel Celeron Processor N3010</td>
							<td>Intel Atom Processor C3558</td>
							<td>Intel Core i5-7500 Processor</td>
							<td>Intel Core i5-7500 Processor</td>
						</tr>
						<tr>
							<th scope='row'>Ethernet Ports</th>
							<td>3 x GbE RJ45</td>
							<td>6 x GbE RJ45, 2 x SFP</td>
							<td>6 x GbE RJ45</td>
							<td>14 x GbE RJ45</td>
						</tr>
						<tr>
							<th scope='row'>RAM</th>
							<td>8GB DDR3 Memory</td>
							<td>8GB DDR4 Memory</td>
							<td>16GB DDR4 Memory</td>
							<td>16GB DDR4 Memory</td>
						</tr>
						<tr>
							<th scope='row'>Memory</th>
							<td>32GB mSATA</td>
							<td>32GB, 2.5" SATA SSD</td>
							<td>32GB, 2.5" SATA SSD</td>
							<td>32GB, 2.5" SATA SSD</td>
						</tr>
						<tr>
							<th scope='row'>I/O Interfaces</th>
							<td>1 x RJ45 Console, 1 x USB 3.0, 1 x USB 2.0, 1 x HDMI port</td>
							<td>1x RJ45 Console, 2 x USB 2.0</td>
							<td>1 x RJ45 Console, 2 x USB 2.0, LCD Display</td>
							<td>1 x RJ45 Console, 2 x USB 2.0, LCD Display</td>
						</tr>
						<tr>
							<th scope='row'>Cooling</th>
							<td>No Fan</td>
							<td>1 x Cooling Fan w/ Smart Fan</td>
							<td>2 x Cooling Fans</td>
							<td>2 x Cooling Fans</td>
						</tr>
						<tr>
							<th scope='row'>Firewall Throughput</th>
							<td>500 Mbps</td>
							<td>900 Mbps</td>
							<td>900 Mbps</td>
							<td>900 Mbps</td>
						</tr>
						<tr>
							<th scope='row'>Weight (lb/kg)</th>
							<td>1,1 lb / 0.5 kg</td>
							<td>2.6 lb / 1.2 kg</td>
							<td>16.5 lb / 7.5 kg</td>
							<td>16.5 lb / 7.5 kg</td>
						</tr>
						<tr>
							<th scope='row'>Dimensions</th>
							<td>(W x H x D) 136.76 mm x 35.5 mm x 119.66 mm (5.38" x 1.40" x 4.71")</td>
							<td>(W x H x D) 231 mm x 44 mm x 200 mm (9.09" x 1.73" x 7.87")</td>
							<td>(W x H x D) 438 mm x 44 mm x 321 mm (17.24" x 1.73" x 12.64")</td>
							<td>(W x H x D) 438 mm x 44 mm x 321 mm (17.24" x 1.73" x 12.64")</td>
						</tr>
						<tr>
							<th scope='row'>Chassis</th>
							<td>Fanless design</td>
							<td>Desktop design</td>
							<td>1U Rack mount unit</td>
							<td>1U Rack mount unit</td>
						</tr>
						<tr>
							<th scope='row'>UTM Throughput</th>
							<td>300 Mbps</td>
							<td>700 Mbps</td>
							<td>900 Mbps</td>
							<td>900 Mbps</td>
						</tr>
						<tr>
							<th scope='row'>Power input</th>
							<td>36W</td>
							<td>60W</td>
							<td>220W</td>
							<td>220W</td>
						</tr>
						<tr>
							<th scope='row'>Warranty</th>
							<td colSpan='4'>Standard 1 year warranty, upgradable to 3 years</td>
						</tr>
					</tbody>
				</table>
			</section>
			<section>
				<h2>Control Box Pricing</h2>
				<PricingTableAppliances
					productName={productData.name}
					applianceDataObject={productData.appliances}
					subscriptionDataObject={productData.unlimitedUsers}
				/>
			</section>
			<section>
				<h2>Control Box Configurator</h2>
				<Configurator productDataArray={productDataArray} />
			</section>
		</Page>
	)
}

export default ControlBox
