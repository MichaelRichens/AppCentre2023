import React from 'react'

const YearsSelect = ({ legend, value, onChange, from, to }) => {
	if (to - from <= 0) {
		return null
	}
	return (
		<fieldset>
			<legend>{legend}</legend>
			<select
				name='years'
				value={value}
				onChange={onChange}
				aria-label={legend}>
				{[...Array(to - from + 1)].map((_, i) => {
					const year = from + i
					return (
						<option key={year} value={year}>
							{`${year} Year${year != 1 ? 's' : ''}`}
						</option>
					)
				})}
			</select>
		</fieldset>
	)
}

export default YearsSelect
