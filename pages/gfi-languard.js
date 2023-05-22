import React from 'react'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('LANGUARD')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const LanGuard = (props) => {
	const { productDataArray } = props

	return (
		<ProductInfoPage
			title='GFI LanGuard'
			subHeading='Comprehensive Network Security and Patch Management'
			productDataArray={productDataArray}>
			<section>
				<p>
					Introducing GFI LanGuard, a powerful network security and vulnerability management solution. GFI LanGuard
					provides comprehensive network scanning, patch management, and vulnerability assessment capabilities to help
					you maintain a secure and compliant IT environment.
				</p>
			</section>
			<section>
				<h2>Overview</h2>
				<p>
					GFI LanGuard is an award-winning network security and patch management solution that empowers businesses to
					manage and maintain end-point protection across their networks. With its robust functionality, GFI LanGuard
					provides deep visibility into all network elements, helps identify potential vulnerabilities, and ensures
					seamless patch deployment.
				</p>
			</section>
			<section>
				<h2>Network Visibility and Threat Management</h2>
				<p>
					One of the standout features of GFI LanGuard is its ability to give you a comprehensive view of your network.
					It automatically discovers and organizes all elements in your network, from computers and laptops to mobile
					devices, printers, servers, and even virtual machines. This includes not just Windows devices but also those
					running on Mac and Linux, ensuring comprehensive coverage across platforms.
				</p>
				<p>
					By grouping your devices, GFI LanGuard facilitates more efficient management, distributing oversight to
					different teams while maintaining a central management dashboard for a complete view. This all-encompassing
					visibility into your network is instrumental in identifying where threats could potentially penetrate your
					defences.
				</p>
			</section>
			<section>
				<h2>Network Vulnerability Detection and Patch Management</h2>
				<p>
					GFI LanGuard takes a proactive approach to network security by routinely scanning your network for missing
					patches, which are often gateways for cyber threats. Its scanning capabilities extend beyond common operating
					systems to web browsers and third-party software. Moreover, it checks for non-patch vulnerabilities by using
					an updated list of over 60,000 known issues, as well as other potential risks like open ports and shared
					directories.
				</p>
				<p>
					Once vulnerabilities have been identified, GFI LanGuard effectively patches them. It does this either
					centrally or by deploying agents on individual machines, thereby eliminating reliance on individuals for
					patching. You have control over which patches to install and can roll back any patches if issues arise. It's
					not just about fixing bugs; these security patches also contribute to the optimal running of applications.
				</p>
			</section>
			<section>
				<h2>Vulnerability Detection Beyond Computers</h2>
				<p>
					GFI LanGuard's reach extends beyond computers and laptops. It is capable of checking vulnerabilities on a
					variety of networked devices such as switches, routers, access points, and printers. It even scans smartphones
					and tablets running on Android and iOS. By doing this, GFI LanGuard ensures a wide net of protection, leaving
					no device unprotected.
				</p>
			</section>
			<section>
				<h2>Compliance Reporting</h2>
				<p>
					In addition to ensuring network security, GFI LanGuard also simplifies compliance processes. It provides
					automated network security reports that can demonstrate compliance with various regulations such as PCI DSS,
					GDPR or NIS. This makes it an invaluable tool for organizations operating in sectors where strict compliance
					norms apply.
				</p>
			</section>
			<section>
				<h2>Advanced Features</h2>
				<p>
					With GFI LanGuard, you benefit from several advanced features. It integrates with over 4,000 third-party
					security applications, including antivirus, anti-spyware, and firewall programs. Furthermore, it keeps track
					of the latest vulnerabilities and missing updates, thanks to a regularly updated vulnerability assessment
					database. This includes standards such as OVAL (with over 11,500 checks) and SANS Top 20, ensuring you're
					always ahead of potential security risks.
				</p>
				<p>
					GFI LanGuard also runs on common virtualization technologies, such as VMware, Microsoft Virtual Server,
					Microsoft Hyper-V, Citrix, and Parallel, thereby providing flexibility in various network environments.
				</p>
			</section>

			<section>
				<h2>Flexible Deployment: Agent-based or Agent-less Mode</h2>
				<p>
					GFI LanGuard offers flexibility in deployment, allowing you to run it in either agent-based or agent-less
					mode. Agent-based technology is beneficial for automated network security audits, distributing the scanning
					load across client machines. On the other hand, the agent-less mode can provide a lightweight alternative for
					certain network environments. This level of adaptability ensures that GFI LanGuard can be effectively
					utilized, no matter the structure or scale of your network.
				</p>
			</section>
			<section>
				<h2>Network Auditing</h2>
				<p>
					Network auditing is a critical aspect of maintaining a secure network, and GFI LanGuard excels in this
					department. It offers a comprehensive view of network elements, including details about connected USB devices,
					installed software, open shares, and open ports. It even provides insights into potential weak passwords and
					hardware information. This in-depth audit empowers you to secure your network further by taking action such as
					closing ports, deleting obsolete users, and disabling unnecessary wireless access points.
				</p>
			</section>
			<section>
				<h2>Web-based Reporting</h2>
				<p>
					With GFI LanGuard, you have access to a web-based reporting interface that uses a secure connection. For
					larger networks, you can install multiple GFI LanGuard instances (sites) and use a single web console for a
					centralized view and aggregated reporting. Reports can be exported to popular formats such as PDF, HTML, XLS,
					XLSX, RTF, and CSV. They can also be scheduled and sent by email, further enhancing the ease of monitoring and
					managing network security.
				</p>
			</section>
			<section>
				<h2>Third-Party Application Integration</h2>
				<p>
					GFI LanGuard integrates with more than 4,000 security applications. This includes antivirus, anti-spyware,
					firewall, anti-phishing, backup client, disk encryption, data loss prevention, and device access control
					software. By providing status reports and lists of installed applications on your network, GFI LanGuard helps
					resolve issues that require attention, such as triggering antivirus or anti-spyware updates.
				</p>
			</section>
			<section>
				<h2>Ensuring Compliance with Various Standards</h2>
				<p>
					Compliance is a significant concern for many organizations, especially those in regulated industries. GFI
					LanGuard provides vulnerability management coupled with extensive reporting to help you comply with standards
					and regulations. It helps safeguard your network and gauge the effectiveness of your PCI DSS, GDPR, NIS, or
					FCA regulations compliance programs. By delivering robust compliance reports, GFI LanGuard makes it easier to
					demonstrate your organization's commitment to security best practices.
				</p>
			</section>
			<section>
				<h2>Key Takeaways</h2>
				<p>
					GFI LanGuard is more than just a network security tool. It's a comprehensive solution that brings together
					network visibility, vulnerability detection, patch management, compliance reporting, and third-party
					application integration. It's designed to protect your network on multiple fronts, ensuring the integrity of
					your systems and data. With GFI LanGuard, you can have the confidence that your network is protected from the
					latest threats, ensuring the smooth operation of your organization.
				</p>
				<p>
					<Link
						className={productInfoStyles.trialLink}
						href='https://www.gfi.com/products-and-solutions/network-security-solutions/languard/request-a-demo'
						target='_blank'
						rel='noopener'>
						Request a Demo today
					</Link>
				</p>
			</section>
		</ProductInfoPage>
	)
}

export default LanGuard
