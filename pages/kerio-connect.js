import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('CONNECT')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const Connect = (props) => {
	const { productDataArray } = props

	return (
		<ProductInfoPage
			title='Kerio Connect'
			subHeading='The Ultimate Mailserver Solution for SMBs'
			logoSrc='images/logos/kerio-connect-logo.svg'
			productName='Kerio Connect'
			productDataArray={productDataArray}>
			<section>
				<p>
					Perfectly tailored for small to medium-sized businesses (SMBs), Kerio Connect is a trusted mail server and
					all-in-one collaboration tool. With its deployment in over 30,000 companies globally, it is compatible with a
					diverse range of operating systems, including Windows, macOS, and Linux.
				</p>
				<p>
					Kerio Connect stands out as an affordable yet robust solution for SMBs. Its easy-to-manage and
					simple-to-deploy nature makes it a top choice for businesses with limited IT resources, proving that you don't
					need a "big brand" solution to achieve efficiency and productivity.
				</p>
			</section>
			<Image src='/images/connect-dashboard1289x750.png' height={750} width={1289} alt='Connect dashboard' />

			<section>
				<h2>Key Features and Benefits</h2>
				<h3>Comprehensive Collaboration and Messaging</h3>
				<p>
					Kerio Connect goes beyond just an email solution, offering a comprehensive suite of features and functionality
					that rivals more complex and expensive systems. Enjoy seamless integration of email with shared calendars,
					scheduling, contact management, tasks, notes, and shared and public folders. Its instant messaging feature is
					XMPP-compatible, allowing you to use various third-party chat/IM applications on both desktop and mobile
					devices.
				</p>
				<p>
					Furthermore, the software supports direct push synchronization to your preferred mobile device via Microsoft
					ActiveSync, keeping your communications consistent and up-to-date across all platforms.
				</p>

				<h3>Effortless Deployment and User-friendly Management</h3>
				<p>
					Kerio Connect stands out with its rapid deployment capability. A full installation can be completed in just
					about 10 minutes, letting your users get started almost immediately. Whether you prefer an on-premises setup
					or a partner-hosted cloud environment, Kerio Connect has you covered.
				</p>
				<p>
					The software supports Mac, Windows, or Linux, and provides full support for Outlook (Windows and Mac) and many
					other IMAP or POP compliant email clients. Its web-based administration interface is simple to navigate, with
					the added convenience of configuration from a tablet.
				</p>
				<h3>Reliable Security for Business Emails</h3>
				<p>
					Kerio Connect prioritises your data's safety. The software is equipped with robust SSL encryption, S/MIME,
					anti-spam, and anti-virus tools to provide thorough protection against hacking and malicious attacks. Its
					automated backup feature, coupled with granular restore options, ensures quick and easy recovery from various
					types of disasters.
				</p>

				<p>
					In addition, Kerio Connect's server-wide archiving feature is designed to prevent data loss and help
					organizations comply with legal requirements for email retention.
				</p>
				<h3>Affordable and Secure Email Package</h3>
				<p>
					Opt for Kerio Connect to take advantage of feature-rich email and collaboration tools at a value price. It
					boasts a powerful multi-engine anti-virus solution, armed with 14 anti-spam filters and 4 anti-virus engines,
					as well as malware scanning.
				</p>
				<p>
					Moreover, the software's secure archiving feature complies with regulatory requirements, offering easy
					management and access to your organization's electronic communications history.
				</p>
			</section>
			<Image
				className={productInfoStyles.smallerImg}
				src='/images/connect-security-policy728x668.png'
				width={728}
				height={668}
				alt='Connect security policy'
			/>
			<section>
				<h2>Detailed Feature Breakdown</h2>
				<h3>Full-featured, Business-class Email</h3>
				<p>
					Kerio Connect provides comprehensive support for various email clients, including Outlook (Windows and Mac),
					native apps for macOS, and any other IMAP or POP compliant email client. Its email service is integrated with
					shared calendars, scheduling, contacts management, tasks, notes, shared and public folders, and instant
					messaging, providing a holistic communication solution.
				</p>
				<p>
					The direct push synchronization to your choice of mobile devices ensures that your communications remain
					consistent across platforms.
				</p>
				<h3>Streamlined Team Communication</h3>
				<p>
					Kerio Connect empowers you to organise your contacts into as many groups as necessary and share them with your
					colleagues. Beyond that, the software lets you:
				</p>
				<ul>
					<li>Create and sort tasks and notes into groups, assign tasks to colleagues, and share notes.</li>
					<li>Schedule events, check attendee availability, and reserve conference rooms.</li>
					<li>Set up recurring events and receive meeting reminders in your inbox.</li>
					<li>
						Benefit from time-saving features such as full-text search, address auto-complete, quick preview of
						attachments, and draft auto-save.
					</li>
				</ul>
				<h3>Integrated Instant Messaging</h3>
				<p>
					Kerio Connect includes a Chat feature for instant message exchange. This functionality enables you to view
					your colleagues' online status and chat with them in real-time, making quick back-and-forth conversations more
					efficient. Business users can engage in real-time chats with the Kerio Connect Client or send and receive
					instant messages with their preferred XMPP/Jabber chat client.
				</p>
				<h3>Robust Mobile Device Support</h3>
				<p>
					Kerio Connect provides comprehensive support for a wide range of devices, including iPhones, Android phones,
					and tablets. The software allows you to choose the synchronization method that best fits your users, ensuring
					consistency between computer and mobile device data.
				</p>
				<p>
					With Kerio Connect, you can easily navigate through public and shared folders and specify which ones to sync
					with your mobile device. This way, you can instantly access shared folders without having to sift through
					irrelevant ones.
				</p>
				<h3>Seamless Bring Your Own Device (BYOD) Support</h3>
				<p>
					Kerio Connect supports many mobile devices using Exchange ActiveSync or IMAP/CalDAV/CardDAV protocols. With
					its robust BYOD capabilities, you can:
				</p>
				<ul>
					<li>Secure communications with SSL and S/MIME protocols to protect mobile users.</li>
					<li>Empower end users to configure their own mobile devices without requiring IT assistance.</li>
					<li>Remotely delete suspicious files and other data from mobile devices to prevent malicious activity.</li>
				</ul>
				<h3>Multiple Platform and Email Client Options</h3>
				<p>
					Administrators have the flexibility to deploy Kerio Connect on the operating system that best suits their
					environment. Apart from supporting Windows, Mac, and Linux, Kerio Connect can also be hosted on hardware or
					virtual environments. The software can scale to multi-server, multi-tenant deployments while maintaining the
					simplicity of day-to-day management. iOS users can set up an account in the popular smart mail application,
					Spark by Readdle, using an integrated Kerio Connect profile.
				</p>
				<h3>Admin-friendly Server and User Management</h3>
				<p>
					With the cloud-based service called MyKerio, administrators can remain in control of all deployments. MyKerio
					provides 24/7 remote monitoring of your deployments, allowing you to view network, licensing, or system
					critical events as they occur.
				</p>
				<p>
					One-click upgrades make it quick and easy to ensure your server is using the latest version. User management
					is also simplified with a straightforward licensing model.
				</p>
				<h3>Integrated Security</h3>
				<p>
					Kerio Connect includes multiple layers of built-in security features to protect your users and network from
					malicious attacks. The software offers:
				</p>
				<ul>
					<li>Powerful identity and content protection with SSL encryption and S/MIME.</li>
					<li>Multiple layers of spam filtering to reduce inbox clutter.</li>
					<li>Protection from viruses, Trojans, worms, spyware, and adware.</li>
					<li>
						An antivirus engine that minimises the impact on memory and system performance while providing comprehensive
						protection.
					</li>

					<li>
						Anti-phishing protection to guard against fraudulent emails designed to steal your personal and financial
						information.
					</li>
				</ul>
				<h3>Data Backup and Recovery</h3>
				<p>
					Kerio Connect's automatic, full, and incremental backup options, coupled with granular restore capabilities,
					ensure that your data can be quickly and easily recovered in the event of a disaster or human error.
				</p>
				<p>
					Whether it's an accidental deletion, hardware failure, or a natural disaster, Kerio Connect has you covered.
					Its built-in archiving feature also helps to prevent data loss and assists in compliance with legal
					requirements for email retention.
				</p>
			</section>
			<Image
				className={productInfoStyles.smallerImg}
				src='/images/connect-configuration-wizard768x588.png'
				width={768}
				height={588}
				alt='Connect security policy'
			/>
			<section>
				<h2>Key Takeaways</h2>
				<p>
					Kerio Connect is an efficient and comprehensive mail server solution designed to meet the specific needs of
					small and medium-sized businesses. Its array of features, including robust email services, instant messaging,
					shared calendars, tasks, and contacts, streamlined team communication tools, and integrated security measures,
					make it an optimal choice for organisations looking for a reliable, secure, and user-friendly communication
					and collaboration platform.
				</p>
				<p>
					With Kerio Connect, you can enhance your business's productivity and efficiency, ensuring smooth and secure
					communication across all devices and platforms. Furthermore, its affordable licensing model and professional
					support provide added value, making it an ideal solution for businesses of all sizes.
				</p>
				<h3 className='clearFloat'>Try Kerio Connect Today</h3>
				<p>Don't just take our word for it, try Kerio Connect free for 30 days and experience:</p>
				<ul>
					<li>Secure and easy-to-install email</li>
					<li>Instant messaging and calendars</li>
					<li>Making BYOD easy</li>
				</ul>
				<Link
					className={productInfoStyles.trialLink}
					href='https://www.gfi.com/products-and-solutions/email-and-messaging-solutions/kerioconnect/free-trial'
					target='_blank'
					rel='noopener'>
					Download Kerio Connect free for 30 days
				</Link>
			</section>
		</ProductInfoPage>
	)
}

export default Connect
