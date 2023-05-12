import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import { formatPriceFromPounds } from '../utils/formatPrice'
import priceTableStyles from '../styles/Table.shared.module.css'

const PriceTableExtensions = ({ productName, extensionsData, unitName }) => {
	const yearLabel = (years) => `${years} Year${years != 1 ? 's' : ''}`
	// relying on productData.extensions being pre-sorted
	const uniqueYears = new Set(extensionsData.map((ext) => yearLabel(ext.years)))
	const uniqueNames = new Set(extensionsData.map((ext) => ext.name))

	const extensionsTable = new TableData(uniqueYears, uniqueNames, 'Subscription Length')

	extensionsData.forEach((ext) => {
		extensionsTable.setData(yearLabel(ext.years), ext.name, formatPriceFromPounds(ext.price))
	})

	return (
		<SimpleTable
			tableData={extensionsTable}
			caption={`Per ${unitName.singularC} Pricing for ${productName} Extensions`}
			className={priceTableStyles.priceTable}
			ariaLabelledby={'pricingHeading'}
		/>
	)
}

export default PriceTableExtensions
