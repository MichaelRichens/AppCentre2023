import React, { useMemo } from 'react'
import Page from './Page'
import PriceTableWithUnits from './PriceTableWithUnits'
import PricingTableAppliances from './PricingTableAppliances'
import PriceTableExtensions from './PriceTableExtensions'
import Configurator from './configurator/Configurator'
import PricingType from '../utils/types/enums/PricingType'
import styles from '../styles/PricingPage.module.css'

/**
 * PricingPage is a wrapper component that renders the Page component with price table and product configurator generated from its props.
 * @param {Object} props - The component properties.
 * @param {string=} props.logoSrc - Optional.  The path to an image file to display as a logo beside the title
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {Object[]} props.productDataArray - The product data pulled from the database, one object for each option (or just one element if there are no options).
 * @param {Object} props.unitName - A createUnitName object representing the unit name in singular and plural forms.
 * @param {React.ReactNode} props.children - The child components to render within the page.*
 * @returns {JSX.Element} The PricingPage component.
 */
const PricingPage = ({ logoSrc, productIntro, productDataArray, unitName, children }) => {
	if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
		throw new Error('Invalid productDataArray')
	}

	const familyName = productDataArray[0].familyName // familyName is the same across all options

	// Check extension options.  Do we have them at all, and if so, are they the same for all options (ie elements of the productDataArray)
	const [haveAnyExtensions, extensionsSameForAllOptions] = useMemo(() => {
		let haveAnyExtensions = false
		let extensionsSameForAllOptions = true
		productDataArray.forEach((productData, index) => {
			if (productData.availableExtensions && productData.availableExtensions.length > 0) {
				// we have extensions for this option
				haveAnyExtensions = true
				if (index > 0) {
					// compare with previous option
					if (
						!(
							productDataArray[index - 1].availableExtensions &&
							productDataArray[index - 1].availableExtensions.length > 0
						)
					) {
						// previous option doesn't have extensions
						extensionsSameForAllOptions = false
					} else if (productData.availableExtensions.length != productDataArray[index - 1].availableExtensions.length) {
						// previous option does have extensions, but a different number of them
						extensionsSameForAllOptions = false
					} else {
						// previous has the same number of extensions - check if they are the same skus
						for (let i = 0; i < productData.availableExtensions.length; i++) {
							if (productData.availableExtensions[i].sku != productDataArray[index - 1].availableExtensions[i].sku) {
								// not the same skus
								extensionsSameForAllOptions = false
								break
							}
						}
					}
				}
			} else if (
				index > 0 &&
				productDataArray[index - 1].availableExtensions &&
				productDataArray[index - 1].availableExtensions.length > 0
			) {
				// no extensions on current options, but previous option did have extensions
				extensionsSameForAllOptions = false
			}
		})

		return [haveAnyExtensions, extensionsSameForAllOptions]
	}, [productDataArray])

	console.log('Full productData', productDataArray[1])

	return (
		<Page title={`${familyName} Pricing`} logoSrc={logoSrc} mainClassName={styles.pricingPage}>
			<section>{productIntro}</section>
			<section className={styles.priceTables}>
				<h2 id='pricingHeading'>{familyName} Pricing</h2>
				{productDataArray.map((productData, index) => (
					<section key={index}>
						{productData.pricingType === PricingType.UNIT ? (
							<PriceTableWithUnits
								productName={productData.name}
								products={productData.products}
								unitName={productData.unitName}
							/>
						) : productData.pricingType === PricingType.HARDSUB ? (
							<PricingTableAppliances
								productName={productData.name}
								applianceDataObject={productData.appliances}
								subscriptionDataObject={productData.unlimitedUsers}
							/>
						) : null}
						{!extensionsSameForAllOptions &&
							productData.availableExtensions &&
							productData.availableExtensions.length > 0 && (
								<PriceTableExtensions
									productName={productData.name}
									extensionsData={productData.extensions}
									unitName={productData.unitName}
								/>
							)}
					</section>
				))}
			</section>
			{haveAnyExtensions && extensionsSameForAllOptions && (
				<PriceTableExtensions
					productName={productDataArray[0].familyName}
					extensionsData={productDataArray[0].extensions}
					unitName={productDataArray[0].unitName}
				/>
			)}
			<section className={styles.Configurator}>
				<h2>{familyName} Configurator</h2>
				<Configurator productDataArray={productDataArray} unitName={unitName} />
			</section>
			{children}
		</Page>
	)
}

export default PricingPage
