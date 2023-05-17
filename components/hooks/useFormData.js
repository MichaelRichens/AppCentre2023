import { useState } from 'react'

function useFormData(initialState) {
	const [formData, setFormData] = useState(initialState)
	//suppressAriaLivePriceUpdate is used to suppress aria-live reading out the price after a type change
	const [suppressAriaLivePriceUpdate, setSuppressAriaLivePriceUpdate] = useState(true)

	const updateFormData = (newData) => {
		const errorFields = ['existingUnitsError', 'unitsChangeError']

		setSuppressAriaLivePriceUpdate(newData.type !== undefined && formData.type !== newData.type)

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
