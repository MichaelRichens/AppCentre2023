import React from 'react'
import { useState, useEffect } from 'react'
import TableData from '../utils/types/TableData'
import formatPrice from '../utils/formatPrice'
import generateUniqueId from '../utils/generateUniqueId'
import priceTableStyles from '../styles/PriceTable.shared.module.css'

const SimpleTable = ({ caption, tableData }) => {
	// Unique ID for the caption element is needed because their might be multiple copies of this component.
	// Have to store it with useState to avoid errors when the generated IDs on the server-side and client-side do not match during server-side rendering (SSR) and client-side hydration (ChatGPT's explanation of the error I had...).
	const [captionId, setCaptionId] = useState('')
	useEffect(() => {
		setCaptionId(generateUniqueId('pts_cap'))
	}, [])

	return (
		<table
			className={priceTableStyles.priceTable}
			aria-labelledby='pricingHeading'
			aria-describedby='pricingCaption'>
			<caption id={captionId}>{caption}</caption>
			{tableData.generate()}
		</table>
	)
}

export default SimpleTable
