import React, { useState, useEffect, useMemo } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
import { useShoppingCart } from 'use-shopping-cart'
import useFormData from '../hooks/useFormData'
import ConfiguratorUnit from './ConfiguratorUnit'
import ProductOptionSelect from './ProductOptionSelect'

import PurchaseType from '../../utils/types/enums/PurchaseType'
import { createAsyncHandleSubmit } from '../../utils/configuratorHandleFunctions'
import processConfiguration from '../../utils/processConfiguration'

import configuratorStyles from '../../styles/Configurator.shared.module.css'
import PricingType from '../../utils/types/enums/PricingType'

/**
 * @component
 * The top level configurator form component that handles an entire product family with multiple options, which can be of different PricingType
 * @param {Object} props - The component props.
 * @param {string} props.productFamily - The code for the product family to create a configurator for
 * @param {Object[]} props.productDataArray - An array of product data object, one for each product option to be displayed, and chosen from in the options control.
 * @param {Word} props.unitName - If units are used, the Word instance which is used to represent them.  TODO don't pass this in at this level, since it prevents multiple types of units being used within a productFamily.  Should be part of the productDataArray objects, but *shrug*, isn't an issue at present.
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

	const [formData, updateFormData, suppressAriaLivePriceUpdate] = useFormData(savedData)

	const { addItem } = useShoppingCart()

	const [addingToCart, setAddingToCart] = useState(false)

	useEffect(() => {
		saveConfiguratorData(productFamily, formData)
	}, [formData])

	const currentConfiguration = useMemo(
		() =>
			processConfiguration(
				productDataArray[formData.optionIndex].name,
				productDataArray[formData.optionIndex].products,
				productDataArray[formData.optionIndex].extensions,
				formData,
				unitName,
				formData.type === PurchaseType.ADD &&
					productDataArray[formData.optionIndex].minUnitsStep < productDataArray[formData.optionIndex].minUnits
					? productDataArray[formData.optionIndex].minUnitsStep
					: null
			),
		[productFamily, productDataArray, formData, unitName]
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
				<ConfiguratorUnit
					productFamily={productFamily}
					productData={productDataArray[formData.optionIndex]}
					unitName={unitName}
					formData={formData}
					updateFormData={updateFormData}
					suppressAriaLivePriceUpdate={suppressAriaLivePriceUpdate}
					addingToCart={addingToCart}
					currentConfiguration={currentConfiguration}
				/>
			)
			break
		default:
			throw new Error(`Unknown PricingType: ${productDataArray[formData.optionIndex].pricingType}`)
	}

	return (
		<form className={configuratorStyles.configurator} onSubmit={asyncHandleSubmit}>
			{productDataArray.length > 1 && (
				<fieldset>
					<legend>{`${productDataArray[0].familyName} Options`}</legend>
					<ProductOptionSelect
						productDataArray={productDataArray}
						currentOptionIndex={formData.optionIndex}
						updateFormData={updateFormData}
					/>
				</fieldset>
			)}
			{subConfigurator}
		</form>
	)
}

export default Configurator
