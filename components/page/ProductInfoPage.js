import React from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import Page from './Page'
import Configurator from '../configurator/Configurator'
import productInfoStyles from '/styles/ProductInfo.shared.module.css'

/**
 * @component
 * A component for generating an info page for a product.  It displays the children content alongside a configurator.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display on the page.
 * @param {string?} props.subHeading - Optional. A supplement to the main title.
 * @param {string?} props.logoSrc - Optional.  The path to an image file to display as the logo of this product
 * @param {Object[]} props.productDataArray - The product data pulled from the database, one object for each option (or just one element if there are no options).
 * @param {JSX.Element} props.children - The child components to render within the page.
 * @returns {JSX.Element} The ProductInfoPage component.
 */
const ProductInfoPage = ({ title, subHeading, logoSrc, productDataArray, children }) => {
	if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
		throw new Error('Invalid productDataArray')
	}
	const showTopConfigurator = useMediaQuery('(min-width: 900px)')

	return (
		<Page title={title} subHeading={subHeading} logoSrc={logoSrc}>
			{showTopConfigurator && (
				<aside className={productInfoStyles.topConfigurator}>
					<Configurator productDataArray={productDataArray} />
				</aside>
			)}
			<article className={productInfoStyles.article}>{children}</article>
			{!showTopConfigurator && (
				<aside>
					<Configurator productDataArray={productDataArray} />
				</aside>
			)}
		</Page>
	)
}

export default ProductInfoPage
