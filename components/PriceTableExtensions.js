import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import { formatPriceFromPounds } from '../utils/formatPrice'
import { yearsGen, unitRangeGen } from '../utils/textSnippetFuncs'
import priceTableStyles from '../styles/PriceTable.shared.module.css'

const PriceTableExtensions = ({ productName, extensionsData, unitName }) => {
	if (!extensionsData || !extensionsData?.length) {
		console.error('Invalid extensionData passed to PriceTableExtensions')
		return null
	}

	// extensionsData is pre-sorted by years low -> high, so no need to sort
	const yearLabels = new Set(extensionsData.map((ext) => yearsGen(ext.years)))

	// Some products have extensions which are sorted into a single sku for a year renewal.  Others have multiple (for different unit tiers)
	// For a single price, we want to display all extensions in one table, for multiple prices we show a table for each extension.
	// Just checking that any extension has multiple prices, don't try and look for some that do and some that don't and get fancy.
	let singleSkuPerYear = true

	const organisedExtensions = extensionsData.reduce((acc, extSkuObj) => {
		if (!acc.hasOwnProperty(extSkuObj.key)) {
			acc[extSkuObj.key] = { name: extSkuObj.name, years: { [extSkuObj.years]: { skus: [extSkuObj] } } }
		} else if (!acc[extSkuObj.key].years.hasOwnProperty(extSkuObj.years)) {
			acc[extSkuObj.key].years[extSkuObj.years] = { skus: [extSkuObj] }
		} else {
			acc[extSkuObj.key].years[extSkuObj.years].skus.push(extSkuObj)
			singleSkuPerYear = false
		}
		return acc
	}, {})

	let tables

	if (singleSkuPerYear) {
		const names = Object.values(organisedExtensions)
			.map((ext) => ext.name)
			.sort((a, b) => a.localeCompare(b))

		const extensionsTable = new TableData(yearLabels, names, 'Subscription Length')

		extensionsData.forEach((ext) => {
			const yearLabel = yearsGen(ext.years)
			extensionsTable.setData(yearLabel, ext.name, formatPriceFromPounds(ext.price))
		})
		tables = (
			<SimpleTable
				tableData={extensionsTable}
				caption={`Per ${unitName.singularC} Pricing for ${productName} Extensions`}
				className={`${priceTableStyles.priceTable} ${priceTableStyles.extensionSubscription}`}
				ariaLabelledby={'pricingHeading'}
			/>
		)
	} else {
		const extensionTables = Object.values(organisedExtensions).map((ext) => {
			const rows = Object.keys(ext.years)
				.sort((a, b) => a < b)
				.map((year) => yearsGen(year))

			const anyYearKey = Object.keys(ext.years)[0]

			const columns = Object.values(ext.years[anyYearKey].skus)
				.sort((a, b) => a.units_from < b.units_from)
				.map((sku) => unitRangeGen(sku.units_from, sku.units_to, unitName))

			const tableData = new TableData(rows, columns, 'Subscription Length')

			extensionsData.forEach((extSkuObj) => {
				console.log(extSkuObj.sku)
				tableData.setData(
					yearsGen(extSkuObj.years),
					unitRangeGen(extSkuObj.units_from, extSkuObj.units_to, unitName),
					formatPriceFromPounds(extSkuObj.price)
				)
			})

			return { name: ext.name, tableData }
		})

		tables = (
			<>
				{extensionTables.map((extensionTable, index) => (
					<SimpleTable
						key={index}
						tableData={extensionTable.tableData}
						caption={`Per ${unitName.singularC} Pricing for ${extensionTable.name} Extension`}
						className={`${priceTableStyles.priceTable} ${priceTableStyles.extensionSubscription}`}
						ariaLabelledby={'pricingHeading'}
					/>
				))}
			</>
		)
	}

	return tables
}

export default PriceTableExtensions
