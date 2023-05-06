import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import Word from '../utils/types/Word'
import formatPrice from '../utils/formatPrice'
import priceTableStyles from '../styles/Table.shared.module.css'

/**
 * PricingWithUnits provides a price table element for the passed products.
 * It is for products which have per unit pricing with unit tiers.
 * @param {Object} props The component properties.
 * @param {string} props.productName - The display name of the product
 * @param {Object} props.products - An array of product objects, assumed to be sorted first by subscription length, then by unit band.  Assume unit bands will be identical for different subscription lengths.
 * @param {Word} unitName - A Word object for the name of the units that are used for price bands (eg Users)
 * @returns {JSX.Element} The pricing element.
 */
const PriceTableWithUnits = ({ productName, products, unitName }) => {
	if (!products || products.length === 0) {
		error.log('No products found.')
		return null
	}

	const rowNameGen = (years) => `${years} Year${years != 1 ? 's' : ''}`
	const columnNameGen = (units_from, units_to, unitName) =>
		`${units_from} ${units_to > units_from ? '- ' + units_to : '+'} ${unitName.pluralC}`

	const rows = new Set(products.map((product) => rowNameGen(product.years)))
	const columns = new Set(products.map((product) => columnNameGen(product.units_from, product.units_to, unitName)))

	const tableData = new TableData(rows, columns, 'Subscription Length')

	for (let i = 0; i < products.length; i++) {
		const product = products[i]
		tableData.setData(
			rowNameGen(product.years),
			columnNameGen(product.units_from, product.units_to, unitName),
			formatPrice(product.price)
		)
	}

	return (
		<SimpleTable
			tableData={tableData}
			caption={`Per ${unitName.singularC} Pricing for ${productName}`}
			className={priceTableStyles.priceTable}
			ariaLabelledby={'pricingHeading'}
		/>
	)
}

export default PriceTableWithUnits
