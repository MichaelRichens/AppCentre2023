import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const Connect = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='Kerio Connect'
			productIntro={
				<>
					<p>
						Introducing Kerio Connect, the all-in-one email and collaboration solution designed to streamline your
						business communications. Trusted by thousands of organizations worldwide, Kerio Connect is the perfect
						choice for small and medium-sized businesses in the UK seeking a reliable, feature-rich, and cost-effective
						mail server.
					</p>
					<p>
						With Kerio Connect, you'll enjoy seamless integration with popular email clients such as Microsoft Outlook,
						Apple Mail, and Mozilla Thunderbird, as well as support for mobile devices and webmail access. This
						cutting-edge platform ensures the highest levels of security, thanks to built-in antivirus and antispam
						filtering, and it can easily integrate with Microsoft Active Directory and Apple Open Directory. Enjoy the
						benefits of email archiving, backup, and recovery features that protect your valuable data, giving you peace
						of mind. Explore our competitive pricing plans and discover how Kerio Connect can revolutionize your
						business communication today.
					</p>
				</>
			}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('user', 'users')}></SubscriptionPage>
	)
}

export default Connect
