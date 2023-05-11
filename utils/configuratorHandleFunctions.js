import PurchaseType from './types/enums/PurchaseType'

export const createHandleTypeChange = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let userChange = formData.userChange
	if ((value === PurchaseType.NEW || value === PurchaseType.ADD) && userChange < productData.minUsers) {
		userChange = productData.minUsers
	} else if (value === PurchaseType.SUB && (formData.type === PurchaseType.NEW || formData.type === PurchaseType.ADD)) {
		userChange = 0
	}

	let years = formData.years
	if (value === PurchaseType.SUB || value === PurchaseType.NEW) {
		// make sure we have a whole number for years
		years = Math.max(productData.minYears, Math.min(productData.maxYears, Math.ceil(formData.years)))
	}

	updateFormData({
		type: value,
		userChange: userChange,
		years: years,
	})
}

export const createHandleExistingUsersBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	let existingUsersError = false
	if (isNaN(value) || value == '') {
		updateFormData({
			existingUsers: productData.minUsers,
		})
		return
	} else {
		let existingUsers = Math.min(Math.max(parseInt(event.target.value), 1), productData.maxUsers)
		if (formData.type === PurchaseType.SUB) {
			const remainder = existingUsers % productData.minUsers
			if (remainder !== 0) {
				existingUsers += productData.minUsers - remainder
				existingUsersError = `Must be renewed in blocks of ${productData.minUsers}.`
			}
		}
		updateFormData({
			existingUsers: existingUsers,
			existingUsersError: existingUsersError,
		})
	}
}

export const createHandleExistingUsersChange = (updateFormData) => (event) => {
	const { value } = event.target
	if (isNaN(value)) {
		return
	}
	updateFormData({
		existingUsers: value == '' ? '' : parseInt(value),
	})
}

export const createHandleUserChangeChange = (updateFormData, formData) => (event) => {
	const { value } = event.target
	if (isNaN(value) && (formData.type != PurchaseType.SUB || value != '-')) {
		return
	}
	let userChange
	if (value == '' || value == '-') {
		userChange = value
	} else {
		userChange = parseInt(value)
	}
	updateFormData({
		userChange: userChange,
	})
}

export const createHandleUserChangeBlur = (updateFormData, formData, productData) => (event) => {
	const { value } = event.target
	// early exit if NaN entered - not an error, since its probably been left blank, just set to default minimum.
	if (isNaN(value)) {
		updateFormData({
			userChange: formData.type == PurchaseType.ADD ? productData.minUserChange : 0,
		})
		return
	}
	let userChangeError = false
	// Parse the user input as an integer.
	let userChange = !isNaN(parseInt(value)) ? parseInt(value) : 0
	// Calculate the minimum and maximum user change values based on the type of subscription.
	const minUserChange =
		formData.type === PurchaseType.NEW || formData.type === PurchaseType.ADD
			? productData.minUsers
			: productData.minUsers - formData.existingUsers
	const maxUserChange = productData.maxUsers - formData.existingUsers
	const userChangeBeforeClamp = userChange
	// Clamp the userChange value to be between minUserChange and maxUserChange.
	userChange = Math.min(Math.max(userChange, minUserChange), maxUserChange)
	if (userChange !== userChangeBeforeClamp) {
		if (userChange === minUserChange) {
			userChangeError = `Minimum Allowed Value: ${minUserChange}`
		} else if (userChange == maxUserChange) {
			userChangeError = `Maximum Allowed Value ${maxUserChange}`
		}
	}

	// Calculate the remainder of userChange when divided by productData.minUsers.
	const remainder = userChange % productData.minUsers

	// If the remainder is not 0, it means the userChange value is not divisible by productData.minUsers.
	// Positive remainder means positive number (adding users), negative remainder is removing users.
	if (remainder > 0) {
		userChange += productData.minUsers - remainder
		userChangeError = `Must be changed in steps of ${productData.minUsers}`
	} else if (remainder < 0) {
		userChange -= remainder
		userChangeError = `Must be changed in steps of ${productData.minUsers}`
	}
	updateFormData({
		userChange: userChange,
		userChangeError: userChangeError,
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

export const createAsyncHandleSubmit = (productFamily, unitName, formData, addItem) => async (event) => {
	event.preventDefault()

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
			// Assuming the returned product data has the necessary properties
			// You may need to adjust this depending on the actual structure of your product data
			addItem({
				id: result.key,
				name: result.name,
				price: result.price,
				currency: process.env.NEXT_PUBLIC_CURRENCY_LC,
				quantity: 1,
			})
		}
	} catch (error) {
		console.error('Error submitting form data:', error)
	}
}
