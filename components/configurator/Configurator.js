import React, { useState, useEffect, useMemo } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
import { useShoppingCart } from 'use-shopping-cart'
import useFormData from '../hooks/useFormData'
import ConfiguratorHardSub from './ConfiguratorHardSub'
import ConfiguratorUnit from './ConfiguratorUnit'
import SubscriptionSummary from './SubscriptionSummary'
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
 * @param {Object[]} props.productDataArray - An array of product data object, one for each product option to be displayed, and chosen from in the options control.
 * @param {Object} props.unitName - If units are used, the Word instance which is used to represent them.  TODO don't pass this in at this level, since it prevents multiple types of units being used within a productFamily.  Should be part of the productDataArray objects, but *shrug*, isn't an issue at present.
 * @returns The Configurator form element.
 */
const Configurator = ({ productDataArray, unitName }) => {
	const productFamily = productDataArray[0].productFamily // by definition, all elements of productDataArray have the same productFamily value
	const { configuratorData, saveConfiguratorData } = useConfiguratorContext()

	// Basic state shared by any possible combination of options
	// sub components (ie different productOptions) share a single state.
	const savedData = configuratorData[productFamily] || {
		optionIndex: 0,
		unType: PurchaseType.SUB,
		hsType: PurchaseType.SUB,
		existingUnitsLiveUpdate: productDataArray[0].minUnits,
		existingUnits: productDataArray[0].minUnits,
		unitsChangeLiveUpdate: 0,
		unitsChange: 0,
		unitCheckedExtensions: [],
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
		() => processConfiguration(productDataArray[formData.optionIndex], formData, unitName),
		[productFamily, productDataArray, formData, unitName]
	)

	const asyncHandleSubmit = createAsyncHandleSubmit(
		productFamily,
		productDataArray[formData.optionIndex].productOption,
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
				/>
			)
			break
		case PricingType.HARDSUB:
			subConfigurator = (
				<ConfiguratorHardSub
					productData={productDataArray[formData.optionIndex]}
					formData={formData}
					updateFormData={updateFormData}
				/>
			)
			break
		default:
			throw new Error(`Unknown PricingType: ${productDataArray[formData.optionIndex].pricingType}`)
	}

	console.log('formData', formData)
	console.log('currentConfiguration', currentConfiguration)
	console.log('productDataArray', productDataArray)

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
			{formData.validState && currentConfiguration.summary && (
				<fieldset className={configuratorStyles.summary}>
					<legend>Summary</legend>
					<SubscriptionSummary
						allowAddToCart={!(formData.unType === PurchaseType.EXT && formData?.unitCheckedExtensions?.length === 0)}
						configuration={currentConfiguration.summary}
						haveExtensionOptions={productDataArray[formData.optionIndex]?.availableExtensions?.length > 0}
						addToCartInProgress={addingToCart}
						haveJustChangedType={suppressAriaLivePriceUpdate}
					/>
				</fieldset>
			)}
		</form>
	)
}

export default Configurator
