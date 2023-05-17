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
			subHeading=''
			productFamily='HELPDESK'
			productDataArray={productDataArray}
			unitName={new Word('user', 'users')}>
			<p>text</p>{' '}
		</ProductInfoPage>
	)
}

export default HelpDesk
