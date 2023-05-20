import React from 'react'
import generateUniqueId from '../utils/generateUniqueId'

import styles from '../styles/SimpleInputNumber.module.css'

/**
 * SimpleInputNumber component.
 *
 * This component renders a number input field with an associated label, and
 * displays an error message if there's any.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.label - The label text for the field.
 * @param {number} props.min - The minimum value for the input field.
 * @param {number} props.max - The maximum value for the input field.
 * @param {number} props.step - The step value for the input field.
 * @param {number} props.value - The current value of the input field.
 * @param {Function} props.onChange - The onChange event handler for the input field.
 * @param {Function} props.onBlur - The onBlur event handler for the input field.
 * @param {string|boolean} props.error - The error message, or false if there is no error.
 */
const SimpleInputNumber = ({ label, min, max, step, value, onChange, onBlur, error }) => {
	const inputId = `numIn${generateUniqueId()}`

	return (
		<div className={styles.container}>
			<label htmlFor={inputId}>
				{`${label}: `}
				{error !== false && <span className={`formError ${styles.error}`}> {error}</span>}
			</label>
			<input
				id={inputId}
				type='number'
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	)
}

export default SimpleInputNumber
