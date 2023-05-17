import React from 'react'
import Page from './Page'
import PriceTableWithUnits from './PriceTableWithUnits'
import PriceTableExtensions from './PriceTableExtensions'
import Configurator from './configurator/Configurator'
import PricingType from '../utils/types/enums/PricingType'
import styles from '../styles/PricingPage.module.css'

/**
 * PricingPage is a wrapper component that renders the Page component with price table and product configurator generated from its props.
 * @param {Object} props - The component properties.
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {string} props.productFamily - The product family identifier.
 * @param {Object[]} props.productDataArray - The product data pulled from the database, one object for each option (or just one element if there are no options).
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @param {React.ReactNode} props.children - The child components to render within the page.*
 * @returns {JSX.Element} The PricingPage component.
 */
const PricingPage = ({ productIntro, productFamily, productDataArray, unitName, children }) => {
	if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
		throw new Error('Invalid productDataArray')
	}

	const familyName = productDataArray[0].familyName // familyName is the same across all options

	return (
		<Page title={familyName}>
			<section>{productIntro}</section>
			<section className={styles.priceTables}>
				<h2 id='pricingHeading'>{familyName} Pricing</h2>
				{productDataArray.map((productData, index) => (
					<section key={index}>
						{productData.pricingType === PricingType.UNIT ? (
							<PriceTableWithUnits productName={productData.name} products={productData.products} unitName={unitName} />
						) : null}
						{productData.availableExtensions && productData.availableExtensions.length > 0 ? (
							<PriceTableExtensions
								productName={productData.name}
								extensionsData={productData.extensions}
								unitName={unitName}
							/>
						) : null}
					</section>
				))}
			</section>
			<section className={styles.Configurator}>
				<h2>{familyName} Configurator</h2>
				<Configurator productFamily={productFamily} productDataArray={productDataArray} unitName={unitName} />
			</section>
			{children}
		</Page>
	)
}

export default PricingPage
