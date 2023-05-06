import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_ARCHIVER)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const Archiver = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='GFI Archiver'
			productIntro={
				<>
					<p>
						Discover GFI Archiver, an innovative email archiving and management solution that caters to businesses of
						all sizes in the UK. GFI Archiver ensures regulatory compliance, optimizes mail server performance, and
						simplifies data retrieval by securely storing and indexing your organization's emails, files, and calendar
						entries.
					</p>
					<p>
						With GFI Archiver, you can reduce the load on your mail server and improve its efficiency by offloading the
						storage of historical data. It also provides comprehensive search capabilities, making it effortless for
						users to locate and retrieve important information. The centralized storage system offers advanced security
						measures to protect your business data from unauthorized access, tampering, or loss.
					</p>
					<p>
						In addition to email archiving, GFI Archiver offers invaluable features such as file archiving, calendar
						synchronization, and mobile device support, ensuring seamless access to crucial business data at all times.
						Its compatibility with leading email servers, including Microsoft Exchange and Kerio Connect, guarantees
						seamless integration into your existing infrastructure. Explore the available pricing plans and learn how
						GFI Archiver can enhance your organization's email management and compliance today.
					</p>
				</>
			}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_ARCHIVER}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('mailbox', 'mailboxes')}></SubscriptionPage>
	)
}

export default Archiver
