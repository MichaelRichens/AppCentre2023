import React from 'react'
import PurchaseType from '../../utils/types/enums/PurchaseType'

/**
 * @component
 * TypeChangeSelect component allows the user to select a purchase type.
 * @param {Object} props - The component's props.
 * @param {PurchaseType} props.type - The current selected type of configurator action.
 * @param {Object} props.typeOptions - The available options to choose from, has members of the PurchaseType enum as keys, with values being the text to display for them
 * @param {function} props.onTypeChange - Callback to handle changes to the selected type.
 * @returns {ReactElement} The rendered TypeChangeSelect component.
 */
const TypeChangeSelect = ({ type, typeOptions, addUserOption, addExtOption, onTypeChange }) => {
	return (
		<select name='type' value={type} onChange={onTypeChange} aria-label='Type of Purchase'>
			{Object.keys(typeOptions).map((key) => (
				<option value={key} key={key}>
					{typeOptions[key]}
				</option>
			))}
		</select>
	)
}

export default TypeChangeSelect
