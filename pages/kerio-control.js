import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_CONTROL)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const Control = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='Kerio Control'
			productIntro={
				<>
					<p>
						Introducing Kerio Control, a comprehensive network security and management solution designed to protect your
						business from threats while optimizing your resources. Ideal for small and medium-sized businesses in the
						UK, Kerio Control offers a robust set of features that ensure your network remains secure and efficient.
					</p>
					<p>
						Kerio Control boasts a powerful firewall, intrusion detection and prevention (IDP), and VPN capabilities to
						safeguard your network from malicious attacks and unauthorized access. With its advanced bandwidth
						management and QoS features, it prioritizes critical business applications, ensuring that your network
						operates at peak performance. In addition, its detailed reporting and monitoring tools provide valuable
						insights into network usage, helping you make informed decisions for your organization.
					</p>
					<p>
						Experience seamless integration with popular directory services such as Microsoft Active Directory and Apple
						Open Directory, simplifying user management and authentication. With Kerio Control's flexible deployment
						options, including hardware, software, and virtual appliances, you can choose the best fit for your unique
						business needs. Explore the available pricing plans and find out how Kerio Control can elevate your network
						security and performance today.
					</p>
				</>
			}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONTROL}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('user', 'users')}></SubscriptionPage>
	)
}

export default Control
