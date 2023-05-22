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
		<ProductInfoPage title='GFI MAILESSENTIALS' subHeading='subheading' productDataArray={productDataArray}>
			<section>Content goes here.</section>
		</ProductInfoPage>
	)
}

export default MailEssentials
