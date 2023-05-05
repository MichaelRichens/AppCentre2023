import React from 'react'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * PurchaseUnitInput component.
 *
 * This component renders a number input field with an associated legend and
 * displays an error message if there's any.
 *
 * @param {boolean?} props.allowDisplay - Optional parameter.  If false, component will not be rendered.
 * @param {Object} props - The component's props.
 * @param {string} props.legend - The legend text for the fieldset.
 * @param {number} props.min - The minimum value for the input field.
 * @param {number} props.max - The maximum value for the input field.
 * @param {number} props.step - The step value for the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {number} props.value - The current value of the input field.
 * @param {Function} props.onChange - The onChange event handler for the input field.
 * @param {Function} props.onBlur - The onBlur event handler for the input field.
 * @param {string|boolean} props.error - The error message, or false if there is no error.
 */
const PurchaseUnitInput = ({
	allowDisplay,
	legend,
	min,
	max,
	step,
	name,
	value,
	onChange,
	onBlur,
	error,
}) => {
	if (allowDisplay === false) {
		return null
	}
	return (
		<fieldset>
			<legend>{legend}</legend>
			<input
				type='number'
				min={min}
				max={max}
				step={step}
				name={name}
				className={configuratorStyles.unitQty}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				aria-label={legend}
			/>
			{error !== false && (
				<span className={configuratorStyles.formError}>{error}</span>
			)}
		</fieldset>
	)
}

export default PurchaseUnitInput
