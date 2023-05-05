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
 * @param {string|boolean} props.addUserOption - Pass false to not show the PurchaseType.ADD option as a choice, otherwise pass the text to display for that option.
 * @param {string|boolean} props.addExtOption - Pass false to not show the PurchaseType.EXT option as a choice, otherwise pass the text to display for that option.
 * @param {function} props.onTypeChange - Callback to handle changes to the selected type.
 * @returns {ReactElement} The rendered TypeChangeSelect component.
 */
const TypeChangeSelect = ({
	type,
	addUserOption,
	addExtOption,
	onTypeChange,
}) => {
	return (
		<fieldset>
			<legend>Type of Purchase</legend>
			<select
				name='type'
				value={type}
				onChange={onTypeChange}
				aria-label='Type of Purchase'>
				<option value={PurchaseType.SUB}>Existing Subscription Renewal</option>
				<option value={PurchaseType.NEW}>New Subscription</option>
				{addUserOption !== false && (
					<option value={PurchaseType.ADD}>{addUserOption}</option>
				)}
				{addExtOption !== false && (
					<option value={PurchaseType.EXT}>{addExtOption}</option>
				)}
			</select>
		</fieldset>
	)
}

export default TypeChangeSelect
