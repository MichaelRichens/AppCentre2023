import React from 'react'
import Link from 'next/link'
import ProductInfoPage from '../components/ProductInfoPage'
import { asyncFetchAndProcessMultipleOptions } from '../server-utils/asyncFetchAndProcessProducts'
import productInfoStyles from '../styles/ProductInfo.shared.module.css'

export async function getStaticProps() {
	const productDataArray = await asyncFetchAndProcessMultipleOptions('HELPDESK', ['CASE', 'FUSION'])

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
			productDataArray={productDataArray}>
			<section>
				<p>
					GFI HelpDesk is a game-changer in the realm of customer support management. As businesses grow, the management
					of customer support can become a complex task. The use of shared mailboxes like support@company.co.uk may not
					be efficient, possibly affecting team responsiveness, productivity, and the time it takes to handle support
					requests. Enter GFI HelpDesk, a robust, self-hosted service desk solution that consolidates and streamlines
					support functionality.
				</p>
			</section>

			<section>
				<h2>Streamlined Management of Customer Queries and Support</h2>

				<p>
					GFI HelpDesk enables customers to easily log tickets via email or other integrated applications, providing a
					system that tracks these tickets to ensure they're being addressed. Staff members can view, create, assign,
					and resolve support tickets, facilitating better collaboration within your team through helpdesk notes to
					address issues. Furthermore, GFI HelpDesk's email parser rules automate the routing of emails and tickets,
					creating a seamless flow of communication and resolution.
				</p>
			</section>

			<section>
				<h2>An All-encompassing View of Your Customer's Activity</h2>

				<p>
					With GFI HelpDesk, you can offer real-time, enriched support experiences to your customers. As your customers
					type out their enquiry, GFI HelpDesk's dynamic system automatically searches for and suggests answers from
					your knowledge base. This reduces the number of incoming support requests and increases customer satisfaction
					by providing timely and relevant responses.
				</p>
			</section>

			<section>
				<h2>Expanding the Boundaries of Traditional Helpdesks</h2>

				<p>
					GFI HelpDesk is not just another helpdesk solution. It comes packed with features that elevate your customer
					support experience:
				</p>

				<ul>
					<li>
						<strong>Effective Team Collaboration:</strong> With GFI HelpDesk, your team can collaborate on tickets in
						one place. This eliminates the need for managing separate mailboxes and email addresses, enhancing
						productivity and efficiency.
					</li>
					<li>
						<strong>Customer Self-service:</strong> GFI HelpDesk allows your customers to access a knowledge base, which
						you can populate with standard information, how-to's, and instructions. This empowers your customers to find
						answers to their questions independently, freeing up your team to focus on more complex issues.
					</li>
					<li>
						<strong>Dynamic Customisation:</strong> As an admin, you can customise the support centre, create new
						departments, manage rules, workflow, and automation. You can also add custom statuses, priorities and types,
						setting up a system that aligns with your business needs.
					</li>
					<li>
						<strong>Multi-language:</strong> Support your customers in multiple languages.
					</li>
					<li>
						<strong>SLAs:</strong> Build SLAs for response or resolution times to track tickets and customers who most
						need attention.
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
