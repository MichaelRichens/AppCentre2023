import React from 'react'
import ProductInfoPage from '../components/ProductInfoPage'

const Connect = () => {
	return (
		<ProductInfoPage title='Kerio Connect' productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT}>
			<section>
				<p>
					Introducing Kerio Connect, the all-in-one email and collaboration solution designed to streamline your
					business communications. Trusted by thousands of organizations worldwide, Kerio Connect is the perfect choice
					for small and medium-sized businesses in the UK seeking a reliable, feature-rich, and cost-effective mail
					server.
				</p>
				<p>
					With Kerio Connect, you'll enjoy seamless integration with popular email clients such as Microsoft Outlook,
					Apple Mail, and Mozilla Thunderbird, as well as support for mobile devices and webmail access. This
					cutting-edge platform ensures the highest levels of security, thanks to built-in antivirus and antispam
					filtering, and it can easily integrate with Microsoft Active Directory and Apple Open Directory. Enjoy the
					benefits of email archiving, backup, and recovery features that protect your valuable data, giving you peace
					of mind. Explore our competitive pricing plans and discover how Kerio Connect can revolutionize your business
					communication today.
				</p>
			</section>
		</ProductInfoPage>
	)
}

export default Connect
