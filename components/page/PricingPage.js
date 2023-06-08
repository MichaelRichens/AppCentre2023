import React, { useMemo } from 'react'
import Page from './Page'
import PriceTableWithUnits from '../PriceTableWithUnits'
import PricingTableAppliances from '../PricingTableAppliances'
import PriceTableExtensions from '../PriceTableExtensions'
import Configurator from '../configurator/Configurator'
import PricingType from '../../utils/types/enums/PricingType'
import styles from '/styles/PricingPage.module.css'

/**
 * PricingPage is a wrapper component that renders the Page component with price table and product configurator generated from its props.
 * @param {Object} props - The component properties.
 * @param {string=} props.logoSrc - Optional.  The path to an image file to display as a logo beside the title
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {Object[]} props.productDataArray - The product data pulled from the database, one object for each option (or just one element if there are no options).
 * @param {React.ReactNode} props.children - The child components to render within the page.*
 * @returns {JSX.Element} The PricingPage component.
 */
const PricingPage = ({ logoSrc, productIntro, productDataArray, children }) => {
	if (!Array.isArray(productDataArray) || productDataArray.length === 0) {
		throw new Error('Invalid productDataArray')
	}

	const familyName = productDataArray[0].familyName // familyName is the same across all options

	// Check extension options.  Do we have them at all, and if so, are they the same for all options (ie elements of the productDataArray)
	// Also check whether we have any per unit pricing, and generate a string that contains their singularC version combined with '/' if they exist (or empty sting if not)
	// Also checks whether any products that have PricingType.UNIT have user tiers - true if any do, false if all don't or no UNIT type products
	const [haveAnyExtensions, extensionsSameForAllOptions, unitTiersExist, unitNamesString] = useMemo(() => {
		let haveAnyExtensions = false
		let extensionsSameForAllOptions = true
		let unitTiersExist = false
		let units = []
		productDataArray.forEach((productData, index) => {
			// extensions
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
			console.log(productData)

			// Product tiers

			if (!unitTiersExist && productData.pricingType === PricingType.UNIT && productData.products?.length > 0) {
				const firstFrom = productData.products[0].units_from
				const firstTo = productData.products[0].units_to
				for (let i = 1; i < productData.products.length; i++) {
					if (productData.products[i].units_from !== firstFrom || productData.products[i].units_to !== firstTo) {
						unitTiersExist = true
						break
					}
				}
			}

			// unit names
			if (productData.pricingType === PricingType.UNIT) {
				let match = false
				for (const unit of units) {
					if (unit === productData.unitName.singularC) {
						match = true
						break
					}
				}
				if (!match) {
					units.push(productData.unitName.singularC)
				}
			}
		})

		const unitNamesString = units.join('/')

		return [haveAnyExtensions, extensionsSameForAllOptions, unitTiersExist, unitNamesString]
	}, [productDataArray])

	return (
		<Page title={`${familyName} Pricing`} logoSrc={logoSrc} mainClassName={styles.pricingPage}>
			<section className='text'>{productIntro}</section>
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
				<Configurator productDataArray={productDataArray} />
			</section>
			{unitTiersExist && !!unitNamesString && (
				<section className='text'>
					<h2>{unitNamesString} Pricing Tiers</h2>
					<p>
						When you renew an existing subscription, you can freely choose the quantity that you do it for. There is no
						additional cost/saving compared to if your licence was for the new size already. Just input the current
						quantity and use the adjustment box to specify a positive or negative number. You will renew your
						subscription for the new quantity.
					</p>
					<p>
						If you need to add more during a renewal period, this is done for the period up until the renewal date, with
						pricing done on a pro-rata basis over 3 month blocks - ie if you are within 3 months of your renewal date
						you pay 25% of the yearly cost, between 3 - 6 months its 50%, etc.
					</p>
					<p>
						Pricing tiers take effect on a volume tier model - that is the price per unit is decided by the number of
						units, and that price is charged across the board, rather than just on the quantity that fall into that
						tier. This can mean that if you are close to an upper bound on your tier, it can be cheaper to purchase
						additional units to get into the tier above.
					</p>
					{process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'false' && (
						<p>
							The pricing tier that is applied to a purchase is decided by the number of units on the purchase, rather
							than the total number on the actual subscription. In most cases these are the same, but in the case of
							adding additional units between renewal dates, it means the tier is decided by the quantity being added,
							not the total. This means that for larger subscriptions, it can be a significantly cheaper to increase the
							size of the subscription at renewal time, when you can renew the whole subscription for the higher
							quantity. However when done this way, the additions will not be available for use until after the renewal
							date.
						</p>
					)}
				</section>
			)}
			{children}
		</Page>
	)
}

export default PricingPage
