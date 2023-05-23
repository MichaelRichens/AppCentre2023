import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import { formatPriceFromPounds } from '../utils/formatPrice'
import priceTableStyles from '../styles/PriceTable.shared.module.css'

const PriceTableExtensions = ({ productName, extensionsData, unitName }) => {
	if (!extensionsData || !extensionsData?.length) {
		console.error('Invalid extensionData passed to PriceTableExtensions')
		return null
	}

	const yearLabelGen = (years) => `${years} Year${years != 1 ? 's' : ''}`

	// extensionsData is pre-sorted by years low -> high, so no need to sort
	const yearLabels = new Set(extensionsData.map((ext) => yearLabelGen(ext.years)))

	// Some products have extensions which are sorted into a single sku for a year renewal.  Others have multiple (for different unit tiers)
	// For a single price, we want to display all extensions in one table, for multiple prices we show a table for each extension.
	// Just checking that any extension has multiple prices, don't try and look for some that do and some that don't and get fancy.
	let singleSkuPerYear = true

	const organisedExtensions = extensionsData.reduce((acc, ext) => {
		if (!acc.hasOwnProperty(ext.key)) {
			acc[ext.key] = { name: ext.name, years: { [ext.years]: { skus: [ext] } } }
		} else if (!acc[ext.key].years.hasOwnProperty(ext.years)) {
			acc[ext.key].years[ext.years] = { skus: [ext] }
		} else {
			acc[ext.key].years[ext.years].skus.push(ext)
			singleSkuPerYear = false
		}
		return acc
	}, {})

	console.log(singleSkuPerYear, organisedExtensions)

	if (singleSkuPerYear) {
		const names = Object.values(organisedExtensions)
			.map((ext) => ext.name)
			.sort((a, b) => a.localeCompare(b))

		const extensionsTable = new TableData(yearLabels, names, 'Subscription Length')

		extensionsData.forEach((ext) => {
			const yearLabel = yearLabelGen(ext.years)
			extensionsTable.setData(yearLabel, ext.name, formatPriceFromPounds(ext.price))
		})

		return (
			<SimpleTable
				tableData={extensionsTable}
				caption={`Per ${unitName.singularC} Pricing for ${productName} Extensions`}
				className={priceTableStyles.priceTable}
				ariaLabelledby={'pricingHeading'}
			/>
		)
	} else {
		return (
			<>
				{Object.entries(organisedExtensions).map(([key, ext]) => (
					<p>{key}</p>
				))}
			</>
		)
	}
}

export default PriceTableExtensions
