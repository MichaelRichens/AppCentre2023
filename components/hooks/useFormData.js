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
		setSuppressAriaLivePriceUpdate(newData.type !== undefined && formData.type !== newData.type)

		const errorFields = ['existingUnitsError', 'unitsChangeError']

		const updatedData = {
			...formData,
			...newData,
		}

		errorFields.forEach((field) => {
			if (!newData.hasOwnProperty(field)) {
				updatedData[field] = false
			}
		})

		setFormData(updatedData)
	}

	return [formData, updateFormData, suppressAriaLivePriceUpdate]
}

export default useFormData
