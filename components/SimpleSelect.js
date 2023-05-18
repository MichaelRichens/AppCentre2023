import React from 'react'

/**
 * @component
 * SimpleSelect component provides a basic select box from the passed properties.
 * @param {Object} props - The component's props.
 * @param {any} props.value - The current selected value of configurator select.
 * @param {Object[]} props.options - The options elements as an array of objects with `value` and `text` properties.
 * @param {function} props.onChange - The onChange handler function.
 * @returns {ReactElement} The rendered  component.
 */
const SimpleSelect = ({ name, options, value, onChange, ariaLabel }) => {
	return (
		<select name={name} value={value} onChange={onChange} aria-label={ariaLabel}>
			{options.map(({ value, text }, index) => (
				<option value={value} key={index}>
					{text}
				</option>
			))}
		</select>
	)
}

export default SimpleSelect
