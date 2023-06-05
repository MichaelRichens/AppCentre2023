import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

const BusyButton = ({
	isBusy,
	type,
	onClick,
	disabled,
	ariaLabel,
	ariaDescribedBy,
	busyAriaLabel,
	dataTooltipId,
	dataTooltipContent,
	busyWidth = 32,
	busyColour = '#243059',
	busyStrokeColour = '#bbb',
	busyDuration = 1.5,
	children,
}) => {
	return (
		<button
			type={type}
			disabled={disabled || isBusy}
			onClick={onClick}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			data-tooltip-id={dataTooltipId}
			data-tooltip-content={dataTooltipContent}>
			{!isBusy ? (
				children
			) : (
				<div
					style={{
						width: `${children.length / 2}em`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<RotatingLines
						width={busyWidth}
						animationDuration={busyDuration}
						strokeColor={busyStrokeColour}
						color={busyColour}
						ariaLabel={busyAriaLabel}
					/>
				</div>
			)}
		</button>
	)
}

export default BusyButton
