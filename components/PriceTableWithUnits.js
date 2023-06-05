import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import { formatPriceFromPounds } from '../utils/formatPrice'
import { yearsGen, unitRangeGen } from '../utils/textSnippetFuncs'
import priceTableStyles from '/styles/PriceTable.shared.module.css'

/**
 * PricingWithUnits provides a price table element for the passed products.
 * It is for products which have per unit pricing with unit tiers.
 * @param {Object} props The component properties.
 * @param {string} props.productName - The display name of the product
 * @param {Object} props.products - An array of product objects, assumed to be sorted first by subscription length, then by unit band.  Assume unit bands will be identical for different subscription lengths.
 * @param {Object} unitName - A createUnitName object for the name of the units that are used for price bands (eg Users)
 * @returns {JSX.Element} The pricing element.
 */
const PriceTableWithUnits = ({ productName, products, unitName }) => {
	if (!products || products.length === 0) {
		console.error('No products found.')
		return null
	}

	const rows = new Set(products.map((product) => yearsGen(product.years)))
	const columns = new Set(products.map((product) => unitRangeGen(product.units_from, product.units_to, unitName)))

	const tableData = new TableData(rows, columns, 'Subscription Length')

	for (let i = 0; i < products.length; i++) {
		const product = products[i]
		tableData.setData(
			yearsGen(product.years),
			unitRangeGen(product.units_from, product.units_to, unitName),
			formatPriceFromPounds(product.price, false)
		)
	}

	return (
		<SimpleTable
			tableData={tableData}
			caption={`Per ${unitName.singularC} Pricing for ${productName} (excludes vat)`}
			className={`${priceTableStyles.priceTable} ${priceTableStyles.mainSubscription}`}
			ariaLabelledby={'pricingHeading'}
		/>
	)
}

export default PriceTableWithUnits
