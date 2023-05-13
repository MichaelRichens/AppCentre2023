import PurchaseType from './types/enums/PurchaseType'

export const createHandleTypeChange = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let unitsChange = formData.unitsChange
	if ((value === PurchaseType.NEW || value === PurchaseType.ADD) && unitsChange < productData.minUnits) {
		unitsChange = productData.minUnits
	} else if (value === PurchaseType.SUB && (formData.type === PurchaseType.NEW || formData.type === PurchaseType.ADD)) {
		unitsChange = 0
	}

	let years = formData.years
	if (value === PurchaseType.SUB || value === PurchaseType.NEW) {
		// make sure we have a whole number for years
		years = Math.max(productData.minYears, Math.min(productData.maxYears, Math.ceil(formData.years)))
	}

	updateFormData({
		type: value,
		unitsChange: unitsChange,
		years: years,
	})
}

export const createHandleExistingUnitsBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let existingUnitsError = false
	if (isNaN(value) || value == '') {
		updateFormData({
			existingUnits: productData.minUnits,
		})
		return
	} else {
		let existingUnits = Math.min(Math.max(parseInt(event.target.value), 1), productData.maxUnits)
		if (formData.type === PurchaseType.SUB) {
			const remainder = existingUnits % productData.minUnits
			if (remainder !== 0) {
				existingUnits += productData.minUnits - remainder
				existingUnitsError = `Must be renewed in blocks of ${productData.minUnits}.`
			}
		}
		updateFormData({
			existingUnits: existingUnits,
			existingUnitsError: existingUnitsError,
		})
	}
}

export const createHandleExistingUnitsChange = (updateFormData) => (event) => {
	const { value } = event.target
	if (isNaN(value)) {
		return
	}
	updateFormData({
		existingUnits: value == '' ? '' : parseInt(value),
	})
}

export const createHandleUnitsChangeChange = (updateFormData, formData) => (event) => {
	const { value } = event.target
	if (isNaN(value) && (formData.type != PurchaseType.SUB || value != '-')) {
		return
	}
	let unitsChange
	if (value == '' || value == '-') {
		unitsChange = value
	} else {
		unitsChange = parseInt(value)
	}
	updateFormData({
		unitsChange: unitsChange,
	})
}

export const createHandleUnitsChangeBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	// early exit if NaN entered - not an error, since its probably been left blank, just set to default minimum.
	if (isNaN(value)) {
		updateFormData({
			unitsChange: formData.type == PurchaseType.ADD ? productData.minunitsChange : 0,
		})
		return
	}
	let unitsChangeError = false
	// Parse the user input as an integer.
	let unitsChange = !isNaN(parseInt(value)) ? parseInt(value) : 0
	// Calculate the minimum and maximum user change values based on the type of subscription.
	const minunitsChange =
		formData.type === PurchaseType.NEW || formData.type === PurchaseType.ADD
			? productData.minUnits
			: productData.minUnits - formData.existingUnits
	const maxunitsChange = productData.maxUnits - formData.existingUnits
	const unitsChangeBeforeClamp = unitsChange
	// Clamp the unitsChange value to be between minunitsChange and maxunitsChange.
	unitsChange = Math.min(Math.max(unitsChange, minunitsChange), maxunitsChange)
	if (unitsChange !== unitsChangeBeforeClamp) {
		if (unitsChange === minunitsChange) {
			unitsChangeError = `Minimum Allowed Value: ${minunitsChange}`
		} else if (unitsChange == maxunitsChange) {
			unitsChangeError = `Maximum Allowed Value ${maxunitsChange}`
		}
	}

	// Calculate the remainder of unitsChange when divided by productData.minUnits.
	const remainder = unitsChange % productData.minUnits

	// If the remainder is not 0, it means the unitsChange value is not divisible by productData.minUnits.
	// Positive remainder means positive number (adding users), negative remainder is removing users.
	if (remainder > 0) {
		unitsChange += productData.minUnits - remainder
		unitsChangeError = `Must be changed in steps of ${productData.minUnits}`
	} else if (remainder < 0) {
		unitsChange -= remainder
		unitsChangeError = `Must be changed in steps of ${productData.minUnits}`
	}
	updateFormData({
		unitsChange: unitsChange,
		unitsChangeError: unitsChangeError,
	})
}

export const createHandleExtensionCheckboxChange = (updateFormData, formData) => (event) => {
	const { value, checked } = event.target
	let newCheckedExtensions = [...formData.checkedExtensions]
	if (checked) {
		newCheckedExtensions.push(value)
	} else {
		newCheckedExtensions = newCheckedExtensions.filter((extensionKey) => extensionKey !== value)
	}
	updateFormData({ checkedExtensions: newCheckedExtensions })
}

export const createHandleYearsChange = (updateFormData) => (event) => {
	const { value } = event.target
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue

	updateFormData({
		years: finalValue,
	})
}

export const createHandleMonthsRemainingChange = (updateFormData) => (event) => {
	const { value } = event.target
	const parsedValue = parseFloat(value)
	const finalValue = isNaN(parsedValue) ? value : parsedValue
	updateFormData({
		years: finalValue,
	})
}

export const createAsyncHandleSubmit =
	(productFamily, unitName, formData, addItem, setSubmitInProgress) => async (event) => {
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
