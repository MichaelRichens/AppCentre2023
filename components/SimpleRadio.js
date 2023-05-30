import React from 'react'

function SimpleRadio({ name, onChange, value, options }) {
	return (
		<div>
			{options.map((option, index) => (
				<label key={index}>
					<input type='radio' name={name} value={option.value} checked={value === option.value} onChange={onChange} />
					{option.text}
				</label>
			))}
		</div>
	)
}

export default SimpleRadio
