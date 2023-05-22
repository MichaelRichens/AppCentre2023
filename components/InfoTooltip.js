import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import generateUniqueId from '../utils/generateUniqueId'
import styles from '../styles/InfoTooltip.module.css'

/**
 * @returns The tooltip element.
 */
const InfoTooltip = ({ size, children }) => {
	const id = generateUniqueId('tooltip')
	return (
		<div>
			<Image
				src='/images/icons/question_mark50x50.png'
				width={size}
				height={size}
				data-tooltip-id={id}
				data-tooltip-content={children}></Image>
			<Tooltip id={id} />
		</div>
	)
}

export default InfoTooltip
