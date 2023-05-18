import React from 'react'
import PurchaseType from '../../utils/types/enums/PurchaseType'

/**
 * TypeChangeSelect component allows the user to select a purchase type.
 *
 * The component renders a dropdown menu with options to choose between
 * different types of configurator actions, such as subscription renewal, new subscription purchase, etc.
 * The PurchaseType.ADD option is conditionally rendered based on the showaddUserOption prop.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {PurchaseType} props.type - The current selected type of configurator action.
 * @param {Object} props.typeOptions - The available options to choose from, has members of the PurchaseType enum as keys, with values being the text to display for them
 * @param {string|boolean} props.addUserOption - Pass false to not show the PurchaseType.ADD option as a choice, otherwise pass the text to display for that option.
 * @param {string|boolean} props.addExtOption - Pass false to not show the PurchaseType.EXT option as a choice, otherwise pass the text to display for that option.
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
