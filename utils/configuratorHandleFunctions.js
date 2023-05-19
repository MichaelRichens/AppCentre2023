import PurchaseType from './types/enums/PurchaseType'

export const createHandleOptionChange = (updateFormData) => (event) => {
	const { value } = event.target
	updateFormData({
		optionIndex: value,
	})
}

/** @function
 * Handles a generic change in formData, with no validation
 */
export const createUpdateFormValue = (updateFormData, key) => (event) => updateFormData({ [key]: event.target.value })

/**
 * @function
 * Handles the change of type option for the ConfiguratorUnit form, awith specific logic for updating dependent values
 */
export const createHandleUnitTypeChange = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let unitsChange = formData.unitsChange
	if (value === PurchaseType.NEW && unitsChange < productData.minUnits) {
		unitsChange = productData.minUnits
	} else if (value === PurchaseType.ADD && unitsChange < productData.minUnitsStep) {
		unitsChange = productData.minUnitsStep
	} else if (value === PurchaseType.SUB) {
		unitsChange = 0
	}

	let years = formData.unYears
	if (value === PurchaseType.SUB || value === PurchaseType.NEW) {
		// make sure we have a whole number for years
		years = Math.max(productData.minYears, Math.min(productData.maxYears, Math.ceil(formData.unYears)))
	}

	updateFormData({
		unType: value,
		unitsChange: unitsChange,
		unitsChangeLiveUpdate: unitsChange,
		years: years,
	})
}

export const createHandleUnitsExistingChange = (updateFormData) => (event) => {
	const { value } = event.target
	if (isNaN(value)) {
		return
	}
	let unitsExisting
	if (value == '' || value == '-') {
		unitsExisting = value
	} else {
		unitsExisting = parseInt(value)
	}
	updateFormData({
		unitsExistingLiveUpdate: unitsExisting,
	})
}

export const createHandleUnitsChangeChange = (updateFormData, formData) => (event) => {
	const { value } = event.target
	if (isNaN(value) && (formData.unType != PurchaseType.SUB || value != '-')) {
		return
	}
	let unitsChange
	if (value == '' || value == '-') {
		unitsChange = value
	} else {
		unitsChange = parseInt(value)
	}
	updateFormData({
		unitsChangeLiveUpdate: unitsChange,
	})
}

export const createHandleUnitsExistingBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let unitsExistingError = false
	if (isNaN(value) || value == '') {
		updateFormData({
			unitsExistingLiveUpdate: productData.minUnits,
			unitsExisting: productData.minUnits,
		})
		return
	} else {
		let unitsExisting = Math.min(Math.max(parseInt(value), productData.minUnits), productData.maxUnits)
		if (formData.unType === PurchaseType.SUB || formData.unType === PurchaseType.ADD) {
			const remainder = unitsExisting % productData.minUnitsStep
			if (remainder !== 0) {
				unitsExisting += productData.minUnitsStep - remainder
				unitsExistingError = `Must be renewed in blocks of ${productData.minUnitsStep}.`
			}
		}
		updateFormData({
			unitsExisting: unitsExisting,
			unitsExistingLiveUpdate: unitsExisting,
			unitsExistingError: unitsExistingError,
		})
	}
}

export const createHandleUnitsChangeBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	// early exit if NaN entered - not an error, since its probably been left blank, just set to default minimum.
	if (isNaN(value)) {
		const newValue = formData.unType === PurchaseType.ADD ? productData.minUnitsStep : 0
		updateFormData({
			unitsChangeLiveUpdate: newValue,
			unitsChange: newValue,
		})
		return
	}
	let unitsChangeError = false
	// Parse the user input as an integer.
	let unitsChange = !isNaN(parseInt(value)) ? parseInt(value) : 0
	// Calculate the minimum and maximum user change values based on the type of subscription.
	let minUnitsChange
	if (formData.unType === PurchaseType.NEW) {
		minUnitsChange = productData.minUnits
	} else if (formData.unType === PurchaseType.ADD) {
		minUnitsChange = productData.minUnitsStep
	} else {
		minUnitsChange = productData.minUnitsStep - (formData?.unitsExisting || 0)
	}
	const maxUnitsChange = productData.maxUnits - (formData?.unitsExisting || 0)
	const unitsChangeBeforeClamp = unitsChange
	// Clamp the unitsChange value to be between minUnitsChange and maxUnitsChange.
	unitsChange = Math.min(Math.max(unitsChange, minUnitsChange), maxUnitsChange)
	if (unitsChange !== unitsChangeBeforeClamp) {
		if (unitsChange === minUnitsChange) {
			unitsChangeError = `Minimum Allowed Value: ${minUnitsChange}`
		} else if (unitsChange == maxUnitsChange) {
			unitsChangeError = `Maximum Allowed Value ${maxUnitsChange}`
		}
	}

	// Calculate the remainder of unitsChange when divided by productData.minUnitsStep.
	const remainder = unitsChange % productData.minUnitsStep

	// If the remainder is not 0, it means the unitsChange value is not divisible by productData.minUnitsStep.
	// Positive remainder means positive number (adding users), negative remainder is removing users.
	if (remainder > 0) {
		unitsChange += productData.minUnitsStep - remainder
		unitsChangeError = `Must be changed in steps of ${productData.minUnitsStep}`
	} else if (remainder < 0) {
		unitsChange -= remainder
		unitsChangeError = `Must be changed in steps of ${productData.minUnitsStep}`
	}
	updateFormData({
		unitsChange: unitsChange,
		unitsChangeLiveUpdate: unitsChange,
		unitsChangeError: unitsChangeError,
	})
}

export const createHandleExtensionCheckboxChange = (updateFormData, formData) => (event) => {
	const { value, checked } = event.target
	let newCheckedExtensions = [...(formData?.unitCheckedExtensions || [])]
	if (checked) {
		newCheckedExtensions.push(value)
	} else {
		newCheckedExtensions = newCheckedExtensions.filter((extensionKey) => extensionKey !== value)
	}
	updateFormData({ unitCheckedExtensions: newCheckedExtensions })
}

export const createHandleYearsChange = (updateFormData) => (event) => {
	const { value } = event.target
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue

	updateFormData({
		unYears: finalValue,
	})
}

export const createHandleMonthsRemainingChange = (updateFormData) => (event) => {
	const { value } = event.target
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue
	updateFormData({
		unYears: finalValue,
	})
}

export const createAsyncHandleSubmit =
	(productFamily, productOption, unitName, formData, addItem, setSubmitInProgress) => async (event) => {
		event.preventDefault()

		setSubmitInProgress(true)
		try {
			const response = await fetch('/api/save-configuration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					productFamily: productFamily,
					productOption: productOption,
					unitName: unitName,
					formData: formData,
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}\nmessage: ${result.message}`)
			} else {
				// Add item to cart here
				addItem({
					id: result.key,
					name: result.name,
					price: result.price,
					currency: process.env.NEXT_PUBLIC_CURRENCY_UC,
					quantity: 1,
				})
			}
		} catch (error) {
			console.error('Error submitting form data:', error)
		} finally {
			setSubmitInProgress(false)
		}
	}
