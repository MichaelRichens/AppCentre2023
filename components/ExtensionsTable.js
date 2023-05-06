import React from 'react'
import SimpleTable from './SimpleTable'
import TableData from '../utils/types/TableData'
import formatPrice from '../utils/formatPrice'

const ExtensionsTable = ({ productName, extensionsData, unitName }) => {
	const yearLabel = (years) => `${years} Year${years != 1 ? 's' : ''}`
	// relying on productData.extensions being pre-sorted
	const uniqueYears = new Set(extensionsData.map((ext) => yearLabel(ext.years)))
	const uniqueNames = new Set(extensionsData.map((ext) => ext.name))

	const extensionsTable = new TableData(Array.from(uniqueYears), Array.from(uniqueNames), 'Subscription Length')

	extensionsData.forEach((ext) => {
		extensionsTable.setData(yearLabel(ext.years), ext.name, formatPrice(ext.price))
	})

	return (
		<SimpleTable
			caption={`Per ${unitName.singularC} Pricing for ${productName} Extensions`}
			tableData={extensionsTable}
		/>
	)
}

export default ExtensionsTable
