import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import useUniqueId from './hooks/useUniqueId'

import styles from '../styles/EditableField.module.css'

function EditableField({
	type = 'text',
	value,
	onChange,
	validationError = (newValue) => {
		return false
	},
}) {
	// hopefully catch forgetting to set this up
	if (!onChange) {
		onChange = () => {
			console.error('Unhandled value change')
		}
	}

	const inputRef = useRef(null)
	const [editing, setEditing] = useState(false)
	const [confirming, setConfirming] = useState(false)
	const [liveValue, setLiveValue] = useState(value || '')
	const [error, setError] = useState('')

	const tooltipId = useUniqueId('editTt')

	useEffect(() => {
		if (editing && !confirming) {
			inputRef.current.focus()
		}
	}, [editing, confirming])

	const handleBlur = () => {
		if (liveValue === value) {
			setEditing(false)
			return
		}
		const validationResult = validationError(liveValue)
		if (!validationResult) {
			setConfirming(true)
		} else {
			setLiveValue(value)
			setEditing(false)
			setError(validationResult)
		}
	}

	const handleOnChange = (event) => {
		setLiveValue(event?.target?.value)
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleBlur()
		}
	}

	const handleConfirm = async () => {
		setError('')
		await onChange(liveValue)
		setEditing(false)
		setConfirming(false)
	}

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
					{value || 'Not Set'}{' '}
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
					{!!error && <span className='onPageError'>{error}</span>}
				</>
			) : !confirming ? (
				<input
					className={styles.editField}
					ref={inputRef}
					type={type}
					value={liveValue}
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
			) : (
				<>
					Change to: <strong>{liveValue}</strong>
					<button type='button' className={styles.confirm} onClick={handleConfirm}>
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
