import React from 'react'
import { useState, useEffect } from 'react'
import TableData from '../utils/types/TableData'
import generateUniqueId from '../utils/generateUniqueId'

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
	// Unique ID for the caption element is needed because there might be multiple copies of this component.
	// Have to store it with useState to avoid errors when the generated IDs on the server-side and client-side do not match during server-side rendering (SSR) and client-side hydration (ChatGPT's explanation of the error I had...).
	const [captionId, setCaptionId] = useState('')
	useEffect(() => {
		setCaptionId(generateUniqueId('pts_cap'))
	}, [])

	return (
		<table
			className={className}
			aria-labelledby={ariaLabelledby ? ariaLabelledby : undefined}
			aria-describedby={caption ? 'pricingCaption' : undefined}>
			{caption && <caption id={captionId}>{caption}</caption>}
			{tableData.generate()}
		</table>
	)
}

export default SimpleTable
