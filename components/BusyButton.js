import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

const BusyButton = ({
	isBusy,
	type,
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
				<RotatingLines
					width={busyWidth}
					animationDuration={busyDuration}
					strokeColor={busyStrokeColour}
					color={busyColour}
					ariaLabel={busyAriaLabel}
				/>
			) : (
				<button aria-label={ariaLabel} aria-describedby={ariaDescribedBy} type={type} disabled={disabled}>
					{children}
				</button>
			)}
		</>
	)
}

export default BusyButton
