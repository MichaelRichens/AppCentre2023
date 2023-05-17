import React from 'react'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import Word from '../utils/types/Word'
import asyncFetchAndProcessProducts from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	const productDataArray = await Promise.all([
		asyncFetchAndProcessProducts('HELPDESK', 'CASE'),
		asyncFetchAndProcessProducts('HELPDESK', 'FUSION'),
	])

	return {
		props: { productDataArray },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const HelpDesk = (props) => {
	const { productDataArray } = props

	return (
		<ProductInfoPage
			title='GFI HelpDesk'
			subHeading='A Comprehensive, Integrated Helpdesk Solution'
			productFamily='HELPDESK'
			productDataArray={productDataArray}
			unitName={new Word('user', 'users')}>
			{' '}
			<section>
				<p>
					GFI HelpDesk revolutionises the way companies manage customer support. As businesses expand, relying on shared
					mailboxes like support@company.co.uk for customer support can become a burden, often negatively impacting team
					responsiveness, productivity, and turn-around time for support requests. This is where GFI HelpDesk comes into
					play, offering a comprehensive, self-hosted service desk solution that consolidates and integrates support
					functionality.
				</p>
			</section>
			<section>
				<h2>Manage Customer Questions and Support More Easily</h2>

				<p>
					With GFI HelpDesk, customers can easily log tickets through email, chat, or other applications, with the
					ability to track them to ensure they're being addressed. Staff members can see, create, assign, and close
					support tickets, and people inside your company can collaborate through helpdesk notes to solve issues. Teams
					can also create rules for automatic responses or routing based on ticket properties, ticket content, the type
					of customer, and more.
				</p>
			</section>
			<section>
				<h2>See the Full Picture of Your Customer's Activity At-A-Glance</h2>

				<p>
					GFI HelpDesk offers a comprehensive view of every interaction your customer has with your business, in
					real-time. You can log page views, orders, shipping history, help desk searches, or capture events from your
					own product, app, or service. This gives support teams a wealth of information about the customers they help,
					enriching the support experience for the customer and making it easier for your team.
				</p>
			</section>
			<section>
				<h2>Go Beyond the Typical Helpdesk</h2>

				<p>
					GFI HelpDesk is far more than your standard helpdesk solution. It offers a range of features that take your
					customer support to the next level:
				</p>

				<ul>
					<li>
						<strong>Standard and Customizable Reporting:</strong> GFI HelpDesk comes with comprehensive standard reports
						and customizable report functionality, delivering insights on your customers, products and services, and
						support response.
					</li>
					<li>
						<strong>Multi-Language Support:</strong> GFI HelpDesk allows you to support your customers in multiple
						languages, including English (GB), English (US), Italian, Spanish, French, German, Portuguese, Russian, and
						Dutch.
					</li>
					<li>
						<strong>Knowledge Base Creation:</strong> You can generate and add to a library to help your customers
						answer their own questions, with standard information, how-to's, and instructions.
					</li>
					<li>
						<strong>SLAs:</strong> Build Service Level Agreements (SLAs) for response or resolution times, and track
						tickets and customers who most need attention.
					</li>
					<li>
						<strong>Powerful Theme Engine:</strong> GFI HelpDesk features a powerful theme engine that lets you fully
						customise the look and feel of your helpdesk, so it can match the look and feel of your front-facing sites,
						providing a unified experience for your customers.
					</li>
				</ul>
			</section>
			<section>
				<p>
					<Link
						className={productInfoStyles.trialLink}
						href='https://www.gfi.com/products-and-solutions/email-and-messaging-solutions/helpdesk/free-trial'
						target='_blank'
						rel='noopener'>
						Start your free trial today and revolutionise your customer support with GFI HelpDesk!
					</Link>{' '}
				</p>
			</section>
		</ProductInfoPage>
	)
}

export default HelpDesk
