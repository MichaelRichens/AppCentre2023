import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
import { useShoppingCart } from 'use-shopping-cart'
import ConfiguratorWithUnits from './ConfiguratorWithUnits'

import PurchaseType from '../../utils/types/enums/PurchaseType'
import { createAsyncHandleSubmit } from '../../utils/configuratorHandleFunctions'
import processConfiguration from '../../utils/processConfiguration'

import configuratorStyles from '../../styles/Configurator.shared.module.css'
import PricingType from '../../utils/types/enums/PricingType'

/**
 * The top level configurator form component that handles an entire product family with multiple options
 * @returns The Configurator form element.
 */
const Configurator = ({ productFamily, productDataArray, unitName }) => {
	const { configuratorData, saveConfiguratorData } = useConfiguratorContext()

	const savedData = configuratorData[productFamily] || {
		optionIndex: 0,
		type: PurchaseType.SUB,
		existingUnitsLiveUpdate: productDataArray[0].minUnits,
		existingUnits: productDataArray[0].minUnits,
		unitsChangeLiveUpdate: 0,
		unitsChange: 0,
		checkedExtensions: [],
		years: productDataArray[0].minYears,
		unitsChangeError: false,
		existingUnitsError: false,
	}

	const { addItem } = useShoppingCart()

	const [formData, setFormData] = useState(savedData)

	const [lastChangeWasType, setLastChangeWasType] = useState(true)
	/**
	 * Applies any fields in the passed object as changes to the formData object
	 * Leaves other fields as they current are set.
	 * Except: It automatically sets error fields to `false` if they are not explicitly
	 * provided in the newData object.
	 *
	 * @param {Object} newData - An object containing the new form data
	 *      properties to be merged with the current formData state.
	 */

	const updateFormData = (newData) => {
		const errorFields = ['existingUnitsError', 'unitsChangeError']

		setLastChangeWasType(newData.type !== undefined && savedData.type !== newData.type)
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

	const [addingToCart, setAddingToCart] = useState(false)

	useEffect(() => {
		saveConfiguratorData(productFamily, formData)
	}, [formData])

	const currentConfiguration = processConfiguration(
		productDataArray[formData.optionIndex].name,
		productDataArray[formData.optionIndex].products,
		productDataArray[formData.optionIndex].extensions,
		formData,
		unitName
	)

	const productOption = productDataArray[formData.optionIndex].products[0].family_option

	const asyncHandleSubmit = createAsyncHandleSubmit(
		productFamily,
		productOption,
		unitName,
		formData,
		addItem,
		setAddingToCart
	)

	let subConfigurator

	switch (productDataArray[formData.optionIndex].pricingType) {
		case PricingType.UNIT:
			subConfigurator = (
				<ConfiguratorWithUnits
					productFamily={productFamily}
					productData={productDataArray[formData.optionIndex]}
					unitName={unitName}
					formData={formData}
					updateFormData={updateFormData}
					lastChangeWasType={lastChangeWasType}
					addingToCart={addingToCart}
					currentConfiguration={currentConfiguration}
				/>
			)
			break
		default:
			throw new Error(`Unknown PricingType: ${productDataArray[formData.optionIndex].pricingType}`)
	}

	console.log(productDataArray)
	return (
		<form className={configuratorStyles.configurator} onSubmit={asyncHandleSubmit}>
			{subConfigurator}
		</form>
	)
}

export default Configurator
