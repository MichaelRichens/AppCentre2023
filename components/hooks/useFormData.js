import { useState } from 'react'

function useFormData(initialState) {
	const [formData, setFormData] = useState(initialState)
	//suppressAriaLivePriceUpdate is used to suppress aria-live reading out the price after a type change
	const [suppressAriaLivePriceUpdate, setSuppressAriaLivePriceUpdate] = useState(true)

	/**
	 * @callback updateFormDataCallback
	 * @param {Object} newData - An object containing updated form data.
	 */

	const updateFormData = (newData) => {
		setSuppressAriaLivePriceUpdate(newData.unType !== undefined && formData.unType !== newData.unType)

		// These fields get set to false on any change that doesn't specifically set them to true.
		// Used for transient error messages regarding user input
		const resetToFalse = ['unitsExistingError', 'unitsChangeError']

		// These are pairs of fields where if the `update` is passed without the corresponding `main`, the currentlyEditingField flag is set to true
		// In all other cases it is set to false. (for input fields which have these temporary update fields that handle not yet finalised changes, onChange handlers pass the `update` only, onBlur do both)
		// Used for disabling the checkout while the displayed price isn't up to date with changes the user has made in a still active field
		const liveUpdateFields = [
			{ update: 'unitsExistingLiveUpdate', main: 'unitsExisting' },
			{ update: 'unitsChangeLiveUpdate', main: 'unitsChange' },
			{ update: 'hsHardwareQuantityLiveUpdate', main: 'hsHardwareQuantity' },
		]

		const updatedData = {
			...formData,
			...newData,
		}

		resetToFalse.forEach((field) => {
			if (!newData.hasOwnProperty(field)) {
				updatedData[field] = false
			}
		})

		let currentlyEditingField = false
		for (let i = 0; i < liveUpdateFields.length; i++) {
			if (newData.hasOwnProperty(liveUpdateFields[i].update) && !newData.hasOwnProperty(liveUpdateFields[i].main)) {
				currentlyEditingField = true
				break
			}
		}
		updatedData.currentlyEditingField = currentlyEditingField

		setFormData(updatedData)
	}

	return [formData, updateFormData, suppressAriaLivePriceUpdate]
}

export default useFormData
