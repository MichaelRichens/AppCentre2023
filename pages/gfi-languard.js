import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import PricingType from '../utils/types/enums/PricingType'
import Word from '../utils/types/Word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
	const productData = await fetchAndProcessProducts(process.env.NEXT_PUBLIC_PRODUCT_CODE_LANGUARD)

	return {
		props: { productData },
		revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
	}
}

const LanGuard = (props) => {
	const { productData } = props
	return (
		<SubscriptionPage
			productName='GFI LanGuard'
			productIntro={
				<>
					<p>
						Introducing GFI LanGuard, a powerful network security and vulnerability management solution designed for
						businesses in the UK. GFI LanGuard provides comprehensive network scanning, patch management, and
						vulnerability assessment capabilities to help you maintain a secure and compliant IT environment.
					</p>
					<p>
						GFI LanGuard's advanced scanning technology allows you to identify security threats and vulnerabilities
						across your network, including missing patches, misconfigurations, and open ports. By automating the process
						of patch management, GFI LanGuard streamlines the deployment of updates for operating systems and
						third-party applications, ensuring that your systems remain protected against emerging cyber threats.
					</p>
					<p>
						Beyond its security features, GFI LanGuard also offers valuable asset management tools that help you keep
						track of your organization's hardware and software inventory. By generating detailed reports and dashboards,
						you can gain valuable insights into your network's security posture and make informed decisions to enhance
						your overall security strategy. Explore the available pricing options and discover how GFI LanGuard can
						improve your organization's network security and compliance today.
					</p>
				</>
			}
			productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_LANGUARD}
			productData={productData}
			pricingType={PricingType.UNIT}
			unitName={new Word('node', 'nodes')}></SubscriptionPage>
	)
}

export default LanGuard
