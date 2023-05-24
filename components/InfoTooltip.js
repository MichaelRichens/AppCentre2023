import React, { useState, useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import generateUniqueId from '../utils/generateUniqueId'
import styles from '../styles/InfoTooltip.module.css'

/**
 * @component
 * InfoTooltip Component.
 *
 * This component displays a question mark icon, with its children as a tooltip, that provides additional
 * information to the user when hovered over. The tooltip is also accessible
 * to screen readers.
 *
 * @param {Object} props The props.
 * @param {string} props.children The content of the tooltip.
 * @returns {JSX.Element} The rendered InfoTooltip component.
 */
const InfoTooltip = ({ children }) => {
	const [tooltipId, setTooltipId] = useState(undefined)
	const [srId, setSrId] = useState(undefined)

	useEffect(() => {
		setTooltipId(generateUniqueId('tooltip'))
		setSrId(generateUniqueId('sr'))
	}, [])

	return (
		<span className={styles.infoTooltipContainer}>
			<img
				className={styles.icon}
				src='/images/icons/question_mark50x50.png'
				data-tooltip-id={tooltipId}
				data-tooltip-content={children}
				alt='Info'
				aria-describedby={srId}
			/>
			<span id={srId} className='sr-only'>
				{children}
			</span>
			<Tooltip className={styles.tooltipText} id={tooltipId} />
		</span>
	)
}

export default InfoTooltip
