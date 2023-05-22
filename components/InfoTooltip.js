import { Tooltip } from 'react-tooltip'
import generateUniqueId from '../utils/generateUniqueId'
import styles from '../styles/InfoTooltip.module.css'

/**
 * @returns The tooltip element.
 */
const InfoTooltip = ({ size, children }) => {
	const id = generateUniqueId('tooltip')
	const srId = generateUniqueId('sr')
	return (
		<span className={styles.infoTooltipContainer}>
			<img
				className={styles.toolTip}
				src='/images/icons/question_mark50x50.png'
				data-tooltip-id={id}
				data-tooltip-content={children}
				alt='Info'
				aria-describedby={srId}
			/>
			<span id={srId} className='sr-only'>
				{children}
			</span>
			<Tooltip className={styles.toolTipText} id={id} />
		</span>
	)
}

export default InfoTooltip
