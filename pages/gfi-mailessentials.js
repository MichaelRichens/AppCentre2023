import React from 'react'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('MAILESSENTIALS', [
			'ANTISPAM',
			'EMAILSECURITY',
			'UNIFIEDPROTECTION',
		])

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const MailEssentials = (props) => {
	const { productDataArray } = props

	return (
		<ProductInfoPage
			title='GFI MailEssentials'
			subHeading='Your Ultimate Email Security Solution'
			logoSrc='images/logos/gfi-mailessentials-logo.svg'
			productDataArray={productDataArray}>
			<h1>GFI MailEssentials - Your Ultimate Email Security Solution</h1>
			<section>
				<p>
					GFI MailEssentials is a comprehensive and robust email security solution designed to protect your business
					from email-borne threats. With its advanced anti-spam and anti-phishing capabilities, GFI MailEssentials
					ensures that your business communication remains secure and efficient.
				</p>
			</section>
			<section>
				<h2>Key Features:</h2>

				<h3>Advanced Threat Protection</h3>
				<p>
					GFI MailEssentials uses multiple antivirus engines, including BitDefender and Kaspersky, to provide a layered
					defence against viruses, trojans, and other malware. Its real-time detection and filtering capabilities ensure
					that harmful content is identified and blocked before it reaches your network.
				</p>

				<h3>Email Content Filtering</h3>
				<p>
					GFI MailEssentials allows you to set up granular policies for managing email content and attachments. You can
					block specific file types, scan for keywords, and even set up rules based on the size of emails. This level of
					control helps prevent data leaks and ensures that your email communication remains professional and
					appropriate.
				</p>

				<h3>Seamless Integration</h3>
				<p>
					Whether you're using Microsoft Exchange, Office 365, or another SMTP server, GFI MailEssentials integrates
					smoothly with your existing infrastructure. It works in the background, scanning and filtering emails without
					causing any disruption to your email service. Plus, it's compatible with both on-premises and cloud-based
					servers, giving you the flexibility to use it in any environment.
				</p>

				<h3>Comprehensive Reporting</h3>
				<p>
					With GFI MailEssentials, you get access to detailed reports that give you insights into your email usage,
					threat detection, and user activity. You can see which types of threats are being detected, how many emails
					are being processed, and even which users are sending or receiving the most emails. These reports can be
					scheduled and automatically emailed to you, making it easy to stay informed about your email security.
				</p>

				<h3>User-friendly Management</h3>
				<p>
					GFI MailEssentials features an intuitive and user-friendly interface that simplifies the management of your
					email security settings. You can easily configure policies, manage users, and view reports, all from a single
					dashboard. Plus, with its automatic updates, you can be sure that you're always protected against the latest
					threats.
				</p>
			</section>

			<section>
				<h2>Why Choose GFI MailEssentials?</h2>

				<p>
					GFI MailEssentials is trusted by thousands of businesses worldwide for its reliability, ease of use, and
					superior protection capabilities. With GFI MailEssentials, you can focus on your business operations without
					worrying about email security.
				</p>

				<p>Protect your business today with GFI MailEssentials - your ultimate email security solution.</p>
				<Link
					className={productInfoStyles.trialLink}
					href='https://www.gfi.com/products-and-solutions/network-security-solutions/mailessentials/free-trial'
					target='_blank'
					rel='noopener'>
					Download GFI MailEssentials free for 30 days
				</Link>
			</section>
		</ProductInfoPage>
	)
}

export default MailEssentials
