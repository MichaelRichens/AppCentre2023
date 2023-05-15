import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	try {
		const productData = await fetchAndProcessProducts('CONTROL')

		return {
			props: { productData },
			revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		return { notFound: true }
	}
}

const Control = (props) => {
	const productData = props.productData
	return (
		<ProductInfoPage
			title='Kerio Control'
			subHeading='Your Comprehensive Security Solution'
			productName='Kerio Control'
			productFamily='CONTROL'
			productData={props.productData}
			unitName={new Word('user', 'users')}>
			<>
				<section>
					<p>
						Kerio Control is a next-generation firewall and unified threat management (UTM) product, developed
						specifically for small and medium-sized businesses (SMBs) seeking a comprehensive solution to their security
						needs. With Kerio Control, businesses can enjoy:
					</p>
					<ul>
						<li>Next-generation firewall to control network traffic</li>
						<li>Intrusion prevention that detects and blocks threats</li>
						<li>Web content and application filtering</li>
						<li>Secure Virtual Private Network (VPN)</li>
					</ul>
				</section>
				<section>
					<h2>Why Is Security So Important for SMEs?</h2>
					<p>
						Security is a critical and often overlooked element for SMEs. A recent Verizon survey found that 43 percent
						of cyberattacks in 2019 targeted SMEs, forcing 22% of those businesses to halt operations immediately.
					</p>
				</section>
				<section>
					<h2>Firewall + Router: Secure Internet Connectivity</h2>
					<p>
						Kerio Control enables you to configure your firewall with user-friendly traffic rules, controlling in- and
						outbound communications by URL, application, traffic type, and more. Its intrusion detection and prevention
						system constantly monitors network communications for suspicious activity, logging or blocking
						communications depending on the severity.
					</p>
					<p>
						Kerio Control also offers robust protection against viruses, worms, Trojans, and spyware. It goes beyond
						just checking files for malicious code; it actively scans your network traffic for potential attacks.
					</p>
				</section>
				<section>
					<h2>Secure VPN Connectivity</h2>
					<p>
						Kerio Control allows you to create secure, high-performance server-to-server connections between your
						offices with a straightforward VPN setup. Alternatively, you can establish a secure VPN connection to a
						remote office using industry-standard VPN protocols.
					</p>
				</section>
				<section>
					<h2>Bandwidth Management</h2>
					<p>
						Prioritise and monitor network traffic to guarantee high-speed transmission for your most important traffic
						types. Limit lower priority traffic by setting a bandwidth maximum or ensure high priority traffic by
						assigning minimum thresholds. With Kerio Control, you can also distribute Internet traffic across multiple
						links, ensuring continuous Internet access.
					</p>
					<p>
						Protect your network from bandwidth-hogging web and application traffic such as streaming video, or by
						blocking peer-to-peer networks. Manage or block access to 100+ continuously updated categories of content
						and applications with the optional Kerio Control Web Filter.
					</p>
				</section>
				<section>
					<h2>Easy Deployment and Management</h2>
					<p>
						Kerio Control can be deployed as a software appliance, a virtual machine, or as a hardware appliance. It
						offers three hardware options:
					</p>
					<ul>
						<li>NG110 - perfect for small businesses, remote and home offices</li>
						<li>NG310 - the choice for small businesses planning for growth</li>
						<li>NG510/NG511 - ideal for mid-sized businesses</li>
					</ul>
					<p>
						You can access security settings, manage users and bandwidth, and set policies from a customisable web-based
						interface on your desktop or mobile device. Manage multiple Kerio Control deployments through a centralised
						web interface.
					</p>
				</section>
				<Image
					src='/images/control-traffic-rules722x606.png'
					height={606}
					width={722}
					alt='Traffic Rules control panel'
				/>
				<section>
					<h2>Key Features</h2>
					<ul>
						<li>
							<strong>Flexible Deployment:</strong> Deploy Kerio Control as a software appliance on your own hardware, a
							virtual appliance in an existing VMware environment, or a turnkey hardware appliance. This flexibility
							lets you custom spec your own hardware while avoiding conflicting applications and vulnerable system
							services.
						</li>
						<li>
							<strong>Next-Generation Firewall Capabilities:</strong> Kerio Control is a comprehensive UTM solution
							providing next-generation firewall protection of your network and data. It includes a next-generation
							firewall and router, Intrusion Detection and Prevention (IPS), gateway anti-virus, VPN, and web content
							and application filtering.
						</li>
						<li>
							<strong>Secure VPN:</strong> Link headquarters to remote users and branch offices securely and easily.
							Kerio Control has its own VPN tunnelling with a simple setup. It requires minimal configuration and
							provides a high-performance network connection. You can also use industry-standard IPsec/L2TP for
							connectivity from mobile devices or third-party firewalls.
						</li>
						<li>
							<strong>Usage Reporting:</strong> Kerio Control Statistics lets you track the internet and application
							activities of individual users - from a list of all the sites they've visited to the specific search terms
							they enter on search engines. These insights can help you refine traffic-shaping rules, monitor employee
							performance and more. Reports can automatically run on a schedule and be emailed to you, eliminating the
							need to manually pull reports each week.
						</li>
						<li>
							<strong>Quality of Service (QoS):</strong> Kerio Control QoS provides fine-grained control over how much
							bandwidth each type of network traffic can consume. Prioritise and monitor network traffic to guarantee
							high-speed transmission for the most important traffic types. Cap lower priority traffic by setting a
							bandwidth maximum or guarantee high priority traffic by assigning a minimum. Kerio Control also uses
							Internet Link load balancing to distribute internet traffic across multiple links.
						</li>
						<li>
							<strong>Easy Administration:</strong> Stay in control of all your Kerio deployments from anywhere using
							MyKerio - a customisable web-based console on your desktop or tablet. Manage multiple Kerio Control
							deployments through a complimentary centralised web interface that provides consolidated system
							information, automatic configuration backup, status monitoring, system notifications, and complete remote
							configuration.
						</li>
						<li>
							<strong>Industry-Leading Web, Content and Application Filtering:</strong> The Kerio Control Web Filter
							lets you allow, deny, or limit the applications, websites, and internet services users can access. It
							continually updates its list of thousands of applications and more than six billion web pages - placing
							them into more than 140 categories. Keep bandwidth-hogging traffic off your network and stop users from
							visiting sites that may contain viruses and spyware. The filter is included in the Kerio Control hardware
							appliance and as an add-on when Kerio Control is deployed as a software or virtual appliance.
						</li>
						<li>
							<strong>Advanced Intrusion Prevention System (IPS):</strong> The Kerio Control IPS adds a transparent
							layer of network protection designed to accurately identify and block attacks while maintaining optimal
							network performance. It protects servers behind the firewall from unauthorised connections and keeps users
							from downloading malicious content or malware. The IPS features Snort-based behaviour analysis and a
							regularly updated database of rules and blocklisted IP addresses from Emerging Threats.
						</li>
						<li>
							<strong>High Availability:</strong> With high availability, if a crash or failure occurs, your second
							Kerio Control machine jumps into action. You have no vulnerability exposure, and your users see no drop of
							service. Without high availability, a primary device failure often leads network administrators to put a
							simple router in place to re-establish connectivity - which can lead to productivity losses and
							vulnerability exposure.
						</li>
					</ul>
				</section>
				<Image
					src='/images/control-box-hardware409x240.png'
					height={240}
					width={409}
					alt='Kerio Control Box Group Shot'
				/>
				<section>
					<h2>Flexible Deployment Options</h2>
					<p>
						Kerio Control is a versatile solution that can be deployed in multiple ways to suit your specific needs. It
						may be installed as a software appliance on your own hardware, as a virtual machine in an existing VMware
						environment, or as a turnkey hardware appliance. This flexibility lets you customise the hardware
						specifications while avoiding conflicting applications and vulnerable system services. All hardware
						appliances include Kerio Antivirus and Kerio Control Web Filter.
					</p>
					<p>The hardware appliance options are:</p>
					<ul>
						<li>
							<strong>NG110:</strong> Perfect for small businesses, remote and home offices.
						</li>
						<li>
							<strong>NG310:</strong> The choice for small businesses planning for growth.
						</li>
						<li>
							<strong>NG510/NG511:</strong> Ideal for mid-sized businesses.
						</li>
					</ul>
				</section>
				<section>
					<h2>Try Kerio Control Today</h2>
					<p>
						Don't just take our word for it, try Kerio Control free for 30 days and experience the powerful features and
						capabilities it offers. Secure your network and ensure your business operations run smoothly with Kerio
						Control.
					</p>
					<Link
						className={productInfoStyles.trialLink}
						href='https://www.gfi.com/products-and-solutions/network-security-solutions/keriocontrol/free-trial'
						target='_blank'
						rel='noopener'>
						Download Kerio Control free for 30 days
					</Link>
				</section>
			</>
		</ProductInfoPage>
	)
}

export default Control
