import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

import styles from '../styles/BusyButton.module.css'

const BusyButton = ({
	isBusy,
	type,
	onClick,
	disabled,
	ariaLabel,
	ariaDescribedBy,
	busyAriaLabel,
	busyWidth = 32,
	busyColour = '#243059',
	busyStrokeColour = '#666',
	busyDuration = 1.5,
	children,
}) => {
	return (
		<>
			{isBusy ? (
				<div className={styles.spinnerWrapper}>
					<RotatingLines
						width={busyWidth}
						animationDuration={busyDuration}
						strokeColor={busyStrokeColour}
						color={busyColour}
						ariaLabel={busyAriaLabel}
					/>
				</div>
			) : (
				<button
					type={type}
					disabled={disabled}
					onClick={onClick}
					aria-label={ariaLabel}
					aria-describedby={ariaDescribedBy}>
					{children}
				</button>
			)}
		</>
	)
}

export default BusyButton
