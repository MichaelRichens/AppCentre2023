import React from 'react'
import Page from './Page'
import PriceTableWithUnits from './PriceTableWithUnits'
import PriceTableExtensions from './PriceTableExtensions'
import ConfiguratorWithUnits from './configurator/ConfiguratorWithUnits'
import PricingType from '../utils/types/enums/PricingType'
import styles from '../styles/PricingPage.module.css'

/**
 * PricingPage is a wrapper component that renders the Page component with price table and product configurator generated from its props.
 * @param {Object} props - The component properties.
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {string} props.productFamily - The product family identifier.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @param {React.ReactNode} props.children - The child components to render within the page.*
 * @returns {JSX.Element} The PricingPage component.
 */
const PricingPage = ({ productIntro, productFamily, productData, unitName, children }) => {
	const haveExtensions = productData.availableExtensions && productData.availableExtensions.length > 0

	return (
		<Page title={productData.name}>
			<section>{productIntro}</section>
			<section className={styles.priceTables}>
				<h2 id='pricingHeading'>{productData.name} Pricing</h2>
				<div>
					{productData.pricingType === PricingType.UNIT ? (
						<PriceTableWithUnits productName={productData.name} products={productData.products} unitName={unitName} />
					) : null}
					{haveExtensions ? (
						<PriceTableExtensions
							productName={productData.name}
							extensionsData={productData.extensions}
							unitName={unitName}
						/>
					) : null}
				</div>
			</section>
			<section className={styles.Configurator}>
				<h2>{productData.name} Configurator</h2>
				<ConfiguratorWithUnits
					productName={productData.name}
					productFamily={productFamily}
					productData={productData}
					unitName={unitName}
				/>
			</section>
			{children}
		</Page>
	)
}

export default PricingPage
