import { useState } from 'react'
import PurchaseType from '../../utils/types/enums/PurchaseType'

function useFormData(initialState) {
	const [formData, setFormData] = useState(initialState)
	//suppressAriaLivePriceUpdate is used to suppress aria-live reading out the price after a type change
	const [suppressAriaLivePriceUpdate, setSuppressAriaLivePriceUpdate] = useState(true)

	/**
	 * @callback updateFormDataCallback
	 * @param {Object} newData - An object containing updated form data.
	 * @param {PurchaseType} purchaseType - The type of purchase being made, required to coerce formData into the correct shape
	 */
	TODO NEXT implemetn purchasetype
	const updateFormData = (newData, purchaseType) => {
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
