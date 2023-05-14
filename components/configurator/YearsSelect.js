import React from 'react'

const YearsSelect = ({ value, onChange, from, to }) => {
	if (to - from <= 0) {
		return null
	}
	return (
		<>
			<select name='years' value={value} onChange={onChange} aria-label='Subscription Length'>
				{[...Array(to - from + 1)].map((_, i) => {
					const year = from + i
					return (
						<option key={year} value={year}>
							{`${year} Year${year != 1 ? 's' : ''}`}
						</option>
					)
				})}
			</select>
		</>
	)
}

export default YearsSelect
