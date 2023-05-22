import React from 'react'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	try {
		const productDataArray = await asyncFetchAndProcessMultipleOptions('ARCHIVER')

		return {
			props: { productDataArray },
			revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
		}
	} catch (error) {
		console.error('Failed to fetch static props', error)
		throw error
	}
}

const Archiver = (props) => {
	const { productDataArray } = props

	return (
		<ProductInfoPage
			title='GFI Archiver'
			subHeading='Archive your emails, calendar, faxes and files with tamper-proof security'
			productDataArray={productDataArray}>
			<section>
				<p>
					GFI Archiver is a robust and comprehensive software solution designed to securely store and manage your
					business's electronic communications. With GFI Archiver, you can archive a range of data types including
					emails, attachments, files, calendar entries, and even faxes, all in a single, centralised location. This
					all-encompassing software not only helps businesses maintain compliance but also significantly improves email
					performance, ultimately reducing costs.
				</p>
			</section>
			<section>
				<h2>Exceptional Features of GFI Archiver</h2>
				<p>GFI Archiver stands out with its array of features tailored to meet the diverse needs of businesses:</p>
				<ul>
					<li>
						<strong>Secure, Central Storage:</strong> GFI Archiver ensures all your electronic communications are
						securely archived in a tamper-proof store. This aids with compliance, e-discovery and facilitates internal
						investigations.
					</li>
					<li>
						<strong>Advanced Search:</strong> Never lose track of your data with GFI Archiver's advanced search
						functionality. Build complex search rules based on date, sender, recipient, and keywords, or use exclusion
						parameters for more targeted searches.
					</li>
					<li>
						<strong>Remote Access:</strong> Access your email history and business-critical documents from anywhere. GFI
						Archiver allows users to view the archive using any IMAP-enabled device, such as an iPhone, iPad or Android,
						or through a web interface.
					</li>
					<li>
						<strong>Calendar Archiving:</strong> Store and track calendar entries and meeting information seamlessly.
						Calendar entries can be accessed from the calendar view or on a mobile device via the IMAP server.
					</li>
					<li>
						<strong>File Sharing and Versioning:</strong> The File Archiving Assistant feature allows users to work on
						shared documents without the need for third-party storage, archiving every file change and creating an
						accessible file history.
					</li>
					<li>
						<strong>Compliance and eDiscovery:</strong> GFI Archiver supports compliance standards by archiving digital
						communications in a secure store. The software includes audit-trail functionality for monitoring database
						and user activity, and its search features enable quick data retrieval for eDiscovery or data requests.
					</li>
					<li>
						<strong>Business Intelligence Reports:</strong> With MailInsights, a reporting tool included in GFI
						Archiver, you can extract data and insights from your email archive. Gain insights into email usage and
						misuse, legal risks, productivity issues, trends, and more.
					</li>
					<li>
						<strong>Flexible Archiving Options:</strong> GFI Archiver offers flexible archiving options to suit your
						business's unique needs. The solution can archive data automatically using the journaling feature or by
						specific criteria with rule-based archiving. Manual archiving lets users decide which emails they want to
						archive.
					</li>
					<li>
						<strong>Efficient, Flexible Storage:</strong> GFI Archiver lets you define the roll-over period for each
						archive store and when to roll over to a new store. The solution is scalable, accommodating the needs of
						both mid-sized organizations with low email volumes and larger organizations.
					</li>
					<li>
						<strong>Administrative Tools:</strong> Streamline the setup and configuration process with GFI Archiver's
						administrative tools. If your organization uses virtualized networks, you can install and integrate a range
						of GFI products.
					</li>
					<li>
						<strong>Fax Integration:</strong> Integrate GFI Archiver with GFI FaxMaker to archive faxes and text
						messages along with emails. This consolidation makes your electronic communications history more accessible
						and manageable.
					</li>
				</ul>
			</section>
			<section>
				<h2>Why Choose GFI Archiver?</h2>
				<p>
					GFI Archiver isn't just an archiving tool - it's a powerful software solution that brings numerous benefits to
					businesses:
				</p>
				<ul>
					<li>
						<strong>Improved Email Performance:</strong> By archiving electronic communications separately from
						applications, GFI Archiver significantly improves email performance, enhancing your overall productivity.
					</li>
					<li>
						<strong>Cost Reduction:</strong> The software reduces costs by employing single-instance storage (SIS),
						storing one copy of a multi-recipient email instead of multiple copies, and compressing (and decompressing)
						email attachments to optimise use of your storage resources.
					</li>
					<li>
						<strong>Compliance and Auditing:</strong> GFI Archiver provides a tamper-proof store for your electronic
						communications history, making compliance, e-discovery, and internal investigations straightforward and
						manageable.
					</li>
					<li>
						<strong>Fast Data Retrieval:</strong> With GFI Archiver, accessing your email history and files is quick and
						easy, whether you're on a desktop or mobile device.
					</li>
				</ul>
			</section>
			<section>
				<h2>Testimonials</h2>
				<p>
					GFI Archiver has helped numerous businesses streamline their electronic communications management. Here's what
					some satisfied customers have to say:
				</p>
				<blockquote>
					When called upon for an HR need, or an audit requirement, the time spent finding the information we need is
					drastically reduced using the product.
					<cite>Rob McQueen, Redding Bank of Commerce</cite>
				</blockquote>
				<blockquote>
					When companies rely on things like legal hold for lawsuits, the ability to quickly find mail from employees is
					a major benefit.
					<cite>Bruce Naylor, FrugalBrothers Software</cite>
				</blockquote>
				<blockquote>
					Installing GFI Archiver meant a reduction in disk space used plus there was no need to upgrade disks in
					servers.
					<cite>Brian Beckett, Robert Scott &amp; Sons Limited</cite>
				</blockquote>
				<blockquote>
					GFI on more than one account has become a very beneficial tool in the daily madness of email data mining.
					<cite>David Ospital, ConSol</cite>
				</blockquote>
			</section>
			<section>
				<h2>Why Choose GFI Archiver?</h2>
				<p>
					In today's digital age, managing electronic communications effectively is critical for every business. GFI
					Archiver offers a robust, reliable, and comprehensive solution to help businesses stay on top of their
					electronic communications, achieve compliance, and improve productivity. With its extensive features, GFI
					Archiver is more than just an archiving tool - it's a complete solution that can significantly enhance your
					business's communications management.
				</p>
				<h3>Download your free trial and experience</h3>
				<ul>
					<li>Archiving email, calendar and files securely</li>
					<li>Minimizing exposure with legal compliance archiving</li>
					<li>Mining your archive to identify opportunities or risks</li>
					<li>Collaborating on files in a secure, searchable system that's not 3rd party</li>
				</ul>
				<p>
					<Link
						className={productInfoStyles.trialLink}
						href='https://www.gfi.com/products-and-solutions/network-security-solutions/archiver/free-trial'
						target='_blank'
						rel='noopener'>
						Download GFI Archiver free for 30 days
					</Link>
				</p>
			</section>
		</ProductInfoPage>
	)
}

export default Archiver
