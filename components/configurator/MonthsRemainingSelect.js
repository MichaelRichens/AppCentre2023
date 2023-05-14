import React, { useState, useEffect } from 'react'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

const MonthsRemainingSelect = ({ value, onChange, maxYears }) => {
	const [renewalDate, setRenewalDate] = useState('')
	const currentDate = new Date()
	const minDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

	const maxDate = new Date(new Date(currentDate).setFullYear(currentDate.getFullYear() + maxYears))
		.toISOString()
		.slice(0, 10)

	useEffect(() => {
		if (renewalDate) {
			const selectedDate = new Date(renewalDate)
			const yearsDifference = selectedDate.getFullYear() - currentDate.getFullYear()
			const monthsDifference = selectedDate.getMonth() - currentDate.getMonth()
			const daysDifference = selectedDate.getDate() - currentDate.getDate()
			const totalMonthsDifference = yearsDifference * 12 + monthsDifference - (daysDifference <= 0 ? 1 : 0)
			if (totalMonthsDifference >= 0) {
				const optionValue = Math.floor(totalMonthsDifference / 3) * 0.25 + 0.25
				const syntheticEvent = {
					target: {
						value: optionValue,
					},
				}
				onChange(syntheticEvent)
			}
		}
	}, [renewalDate])

	return (
		<>
			<label className={configuratorStyles.monthsRemaining}>
				<span>Remaining Time: </span>
				<select
					value={value}
					onChange={(event) => {
						setRenewalDate('')
						onChange(event)
					}}>
					{Array.from({ length: Math.ceil(maxYears * 4) }, (_, index) => {
						const monthEnd = (index + 1) * 3
						const optionValue = (index + 1) * 0.25

						return (
							<option key={index} value={optionValue}>
								{`Less Than ${monthEnd} Months Remaining`}
							</option>
						)
					})}
				</select>
			</label>
			<label className={configuratorStyles.monthsRemaining}>
				<span>Or Choose Renewal Date: </span>
				<input
					type='date'
					value={renewalDate}
					min={minDate}
					max={maxDate}
					onChange={(event) => {
						setRenewalDate(event.target.value)
					}}
				/>
			</label>
		</>
	)
}

export default MonthsRemainingSelect
