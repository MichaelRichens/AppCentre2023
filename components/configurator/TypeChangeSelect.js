import React from 'react'

/**
 * TypeChangeSelect component allows the user to select a purchase type.
 *
 * The component renders a dropdown menu with options to choose between
 * different types of configurator actions, such as subscription renewal, new subscription purchase, etc.
 * The 'add' option is conditionally rendered based on the showAddOption prop.
 *
 * @component
 * @param {Object} props - The component's props.
 * @param {string} props.type - The current selected type of configurator action.
 * @param {string|boolean} props.addOption - Pass false to not show the 'add' option as a choice, otherwise pass the text to display for that option.
 * @param {function} props.onTypeChange - Callback to handle changes to the selected type.
 * @returns {ReactElement} The rendered TypeChangeSelect component.
 */
const TypeChangeSelect = ({ type, addOption, onTypeChange }) => {
  return (
    <fieldset>
      <legend>Type of Purchase</legend>
      <select
        name='type'
        value={type}
        onChange={onTypeChange}
        aria-label='Type of Purchase'>
        <option value='sub'>Existing Subscription Renewal</option>
        <option value='new'>New Subscription</option>
        {addOption !== false && <option value='add'>{addOption}</option>}
      </select>
    </fieldset>
  )
}

export default TypeChangeSelect
