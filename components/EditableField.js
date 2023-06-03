import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import useUniqueId from './hooks/useUniqueId'

import styles from '../styles/EditableField.module.css'

/**
 * An editable field component that allows in-place editing of its value.
 *
 * This component accepts a value and offers an interface to edit it. The new value
 * is confirmed or rejected based on a provided validation function. The component
 * manages its own state during the editing process, but does not update the actual
 * value until confirmed.
 *
 * @component
 * @example
 * // Example usage of EditableField
 * <EditableField
 *     type='text'
 *     value='John Doe'
 *     onChange={(newValue) => console.log("New value: " + newValue)}
 *     validationError={(newValue) => newValue.length > 0 ? false : "Value cannot be empty"}
 * />
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.type='text'] - The type of the input field.
 * @param {string} props.value - The initial value of the field.
 * @param {function} props.onChange - The function to be called when the field value is confirmed.
 * @param {string} [props.emptyValueText=''] - The text to display when the field value is empty.
 * @param {function} [props.validationError=(newValue) => false] - A function to validate the new value. It should return a string (error message) for an invalid value and false for a valid value.
 *
 * @returns {JSX.Element} An element that allows in-place editing of a value.
 */
const EditableField = ({
	type = 'text',
	value,
	onChange,
	emptyValueText = '',
	validationError = (newValue) => {
		return false
	},
}) => {
	const inputRef = useRef(null)
	const confirmRef = useRef(null)
	const [editing, setEditing] = useState(false)
	const [confirming, setConfirming] = useState(false)
	const [liveValue, setLiveValue] = useState(value || '')
	const [error, setError] = useState('')

	const tooltipId = useUniqueId('editTt')

	// Handles setting focus to fields when different stages of the component renders in
	// Also used to force the correct liveValue when editing, see inline comment
	useEffect(() => {
		if (editing && !confirming) {
			// This setLiveValue is important, though I don't 100% understand why.
			// But without it, if we perform a change that is accepted by the passed in validation function, but is then reverted (eg an email address change that firebase rejects)
			// then if the user clicks to edit again, they get the rejected string rather than the current string to edit.  I would have thought the change to the value prop should have triggered a rerender, including regenerating liveValue back to value
			// But apparently not...  Setting liveValue to value at this point resolves the problem.
			setLiveValue(value || '')
			inputRef.current.focus()
		} else if (editing && confirming) {
			confirmRef.current.focus()
		}
	}, [editing, confirming])

	// Handler for when a field edit has been finalised by the user
	// This is where any passed in validation function is executed, and its result, if truthy treated both as a failure and as a text string to display to the user.
	const handleBlur = () => {
		const validationResult = validationError(liveValue)
		// validationResult === false is a pass
		if (!validationResult) {
			// check they aren't still the same, cancel edit if they are (and don't trust === for empty values since we may get a mix of undefined and empty strings)
			if ((!liveValue && !value) || liveValue === value) {
				setEditing(false)
				return
			}
			setConfirming(true)
			return
		}
		// failed validation
		setLiveValue(value)
		setEditing(false)
		setError(validationResult)
	}

	// Handler for text changes during a field edit
	const handleOnChange = (event) => {
		setLiveValue(event?.target?.value)
	}

	// Handler to catch the enter key during a field edit, and treat it as a blur event (and will not pass it up to any parent form element)
	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleBlur()
		}
	}

	// Handler for user making a final confirmation of their edit
	const handleConfirm = async () => {
		setError('')
		await onChange(liveValue)
		setEditing(false)
		setConfirming(false)
	}

	// Handler for the user rejecting their edit
	const handleCancel = () => {
		setLiveValue(value)
		setError('')
		setEditing(false)
		setConfirming(false)
	}

	return (
		<span>
			{!editing ? (
				<>
					{value ? value : emptyValueText}{' '}
					<button
						className={styles.editButton}
						aria-label='Click to Edit'
						type='button'
						onClick={() => setEditing(true)}>
						<img
							src={'/images/icons/edit_icon50x50.png'}
							data-tooltip-id={tooltipId}
							data-tooltip-content='Click to Edit'
							alt='Click to Edit'
						/>
					</button>
					<Tooltip id={tooltipId} />
					{!!error && (
						<>
							{' '}
							<span className='onPageError' aria-live='polite'>
								{error}
							</span>
						</>
					)}
				</>
			) : !confirming ? (
				<input
					className={styles.editField}
					ref={inputRef}
					type={type}
					value={liveValue || ''}
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
			) : (
				<>
					Change to: <strong>{liveValue ? liveValue : emptyValueText}</strong>
					<button ref={confirmRef} type='submit' className={styles.confirm} onClick={handleConfirm}>
						Confirm
					</button>{' '}
					<button type='button' className={styles.cancel} onClick={handleCancel}>
						Cancel
					</button>
				</>
			)}
		</span>
	)
}

export default EditableField
