import PricingType from './types/enums/PricingType'
import PurchaseType from './types/enums/PurchaseType'

/** @function
 * Handles a generic change in formData, with no validation
 * Does coerce 'true'/'false' strings to boolean
 */
export const createUpdateFormValue = (updateFormData, key) => (event) => {
	const value = event.target.value
	let allowBool
	if (value === 'true') {
		allowBool = true
	} else if (value === 'false') {
		allowBool = false
	} else {
		allowBool = value
	}
	updateFormData({
		[key]: allowBool,
	})
}

export const createUpdateFormValueWithFloat = (updateFormData, key) => (event) => {
	const value = event.target.value
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue

	updateFormData({
		[key]: finalValue,
	})
}

/**
 * This creates an onChange handler for an Input, that handles updates while the filed is being edited, before being confirmed separately with onBlur
 * Therefore it has no validation.
 */
export const createHandleInputChange = (updateFormData, updateField) => (event) => {
	let value = event.target.value

	updateFormData({
		[updateField]: value,
	})
}

// An onBlur handler for an Input type number field which has been blurred and needs to be committed to its formData `mainField`, which has had its onChanges handled into a temporary formData `liveUpdateField`
// Not bothering to check things like min < max or min % step === 0
export const createHandleInputNumberBlur =
	(
		updateFormData,
		formData,
		mainField,
		liveUpdateField,
		errorField = undefined,
		min = undefined,
		max = undefined,
		step = undefined
	) =>
	(event) => {
		let value = Number(event.target.value)

		// Early exit and revert to mainField value on invalid input - no error message
		if (isNaN(value) || value === '') {
			updateFormData({ [mainField]: formData[mainField], [liveUpdateField]: formData[liveUpdateField] })
			return
		}

		let error = null
		if (min !== undefined && value < min) {
			value = min
			error = `Must be at least ${min}`
		} else if (max !== undefined && value > max) {
			value = max
			error = `Must be no more than ${max}`
		}

		if (step != undefined && !isNaN(step) && step != 0) {
			const remainder = value % step

			// If the remainder is not 0, it means the  value is not divisible by step.
			// Positive remainder means positive number, negative remainder is negative number
			if (remainder != 0) {
				if (remainder > 0) {
					value += step - remainder
				} else if (remainder < 0) {
					value -= remainder
				}
				error = `Must be changed in steps of ${step}`
			}
		}

		const updateObj = { [mainField]: value, [liveUpdateField]: value }
		if (error !== null && errorField !== undefined) {
			updateObj[errorField] = error
		}

		updateFormData(updateObj)
	}

export const createHandleCheckboxChange = (updateFormData, formData, formDataArrayProperty) => (event) => {
	const { value, checked } = event.target
	let newChecked = [...(formData?.[formDataArrayProperty] || [])]
	if (checked) {
		newChecked.push(value)
	} else {
		newChecked = newChecked.filter((item) => item !== value)
	}
	updateFormData({ [formDataArrayProperty]: newChecked })
}

export const createHandleOptionChange = (updateFormData) => (event) => {
	const value = Number(event.target.value)

	updateFormData({
		optionIndex: value,
	})
}

export const createAsyncHandleSubmit =
	(productFamily, productOption, unitName, formData, addToCart, setSubmitInProgress) => async (event) => {
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
				let purchaseType
				switch (formData.pricingType) {
					case PricingType.UNIT:
						purchaseType = formData.unType
						break
					case PricingType.HARDSUB:
						purchaseType = formData.hsType
						break
					default:
						throw new Error(`Unexpected pricingType: ${formData.pricingType}`)
				}
				addToCart({
					id: result.key,
					name: result.name,
					pricingType: formData.pricingType,
					purchaseType: purchaseType,
					price: result.price,
				})
			}
		} catch (error) {
			console.error('Error submitting form data:', error)
		} finally {
			setSubmitInProgress(false)
		}
	}

/**
 * @function
 * Handles the change of type option for the ConfiguratorUnit form, with specific logic for updating dependent values
 */
export const createHandleUnitTypeChange = (updateFormData, formData, productData) => (event) => {
	const value = event.target.value
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

export const createHandleMonthsRemainingChange = (updateFormData) => (event) => {
	const value = event.target.value
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue
	updateFormData({
		unYears: finalValue,
	})
}

export const createHandleHSTypeChange = (updateFormData, formData, productData) => (event) => {
	const value = event.target.value
	const updateObj = { hsType: value }

	updateFormData(updateObj)
}

export const createHandleHSApplianceChange = (updateFormData, productData) => (event) => {
	const value = event.target.value
	let subFamily

	for (let [subFamilyCode, applianceArray] of Object.entries(productData.appliances)) {
		if (applianceArray.find((item) => item.sku === value)) {
			subFamily = subFamilyCode
			break
		}
	}

	if (!subFamily) {
		console.error('Could not find subFamily')
	}

	updateFormData({ hsSubFamily: subFamily, hsAppliance: value })
}

export const createHandleHSSubFamilyChange = (updateFormData, productData) => (event) => {
	const value = event.target.value
	let defaultAppliance = productData.appliances[value][0].sku

	updateFormData({ hsSubFamily: value, hsAppliance: defaultAppliance })
}
