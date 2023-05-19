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

		const resetToFalse = ['currentlyEditingField', 'unitsExistingError', 'unitsChangeError']

		const updatedData = {
			...formData,
			...newData,
		}

		resetToFalse.forEach((field) => {
			if (!newData.hasOwnProperty(field)) {
				updatedData[field] = false
			}
		})

		setFormData(updatedData)
	}

	return [formData, updateFormData, suppressAriaLivePriceUpdate]
}

export default useFormData
