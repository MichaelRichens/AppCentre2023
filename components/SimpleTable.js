import React from 'react'
import TableData from '../utils/types/TableData'

/**
 * A simple table component with an optional caption and table data.
 *
 * @param {Object} props - Component properties.
 * @param {TableData} props.tableData - Table data.
 * @param {string?} [props.caption] - Optional table caption text.
 * @param {string?} [props.className] - Optional CSS class name for the table.
 * @param {string?} [props.ariaLabelledby] - Optional aria-labelledby attribute for the table.
 * @returns {JSX.Element} A rendered simple table component.
 */
const SimpleTable = ({ tableData, caption, className, ariaLabelledby }) => {
	return (
		<table className={className} aria-labelledby={ariaLabelledby ? ariaLabelledby : undefined}>
			{caption && <caption>{caption}</caption>}
			{tableData.generate()}
		</table>
	)
}

export default SimpleTable
