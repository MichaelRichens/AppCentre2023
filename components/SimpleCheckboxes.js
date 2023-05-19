import React from 'react'
/**
 * SimpleCheckboxes is a React component that renders a list of checkboxes.
 *
 * Each checkbox is labeled with text and has a value. The checkboxes that are
 * currently selected are determined by the 'selected' prop, which is an array
 * of the values of the currently selected checkboxes.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.name - The name attribute for all checkboxes in the group.
 * This is useful for grouping the checkboxes together semantically.
 * @param {Object[]} props.options - The array of options to be shown as checkboxes.
 * Each option is an object with 'value' and 'text' properties, where 'value' is
 * the value attribute of the checkbox and 'text' is the label for the checkbox.
 * @param {Array} props.selected - The array of currently selected values.
 * If an option's value is in this array, then the corresponding checkbox will be checked.
 * @param {Function} props.onChange - The function to call when any checkbox's selection state changes.
 * @returns {JSX.Element} The rendered SimpleCheckboxes component.
 */
const SimpleCheckboxes = ({ name, options, selected, onChange }) => {
	return (
		<>
			{options.map((option, index) => (
				<label key={index}>
					<input
						type='checkbox'
						name={name}
						value={option.value}
						checked={selected.includes(option.value)}
						onChange={onChange}
					/>
					{option.text}
				</label>
			))}
		</>
	)
}

export default SimpleCheckboxes
