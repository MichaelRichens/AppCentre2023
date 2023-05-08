import React from 'react'
import useMediaQuery from './hooks/useMediaQuery'
import Page from './Page'
import SubscriptionConfigurator from './SubscriptionConfigurator'
import styles from '../styles/ProductInfoPage.module.css'

/**
 * @component
 * A component for generating an info page for a product.  It displays the children content alongside a configurator.
 * @param {Object} props - The component props.
 * @param {string} props.productFamily - The product family code.
 * @param {string} props.title - The title to display on the page.
 * @param {JSX.Element} props.children - The child components to render within the page.
 * @returns {JSX.Element} The ProductInfoPage component.
 */
const ProductInfoPage = ({ title, productFamily, productData, unitName, children }) => {
	const showTopConfigurator = useMediaQuery('(min-width: 800px)')
	return (
		<Page title={title}>
			{showTopConfigurator && (
				<section className={styles.topConfigurator}>
					<SubscriptionConfigurator
						productName={title}
						productFamily={productFamily}
						productData={productData}
						unitName={unitName}
					/>
				</section>
			)}
			{children}
			{!showTopConfigurator && (
				<section>
					<SubscriptionConfigurator
						productName={title}
						productFamily={productFamily}
						productData={productData}
						unitName={unitName}
					/>
				</section>
			)}
		</Page>
	)
}

export default ProductInfoPage
