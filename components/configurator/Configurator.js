import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
import { CartContext } from '../contexts/CartContext'
import useFormData from '../hooks/useFormData'
import ProductOptionSelect from './ProductOptionSelect'
import ConfiguratorHardSub from './ConfiguratorHardSub'
import ConfiguratorUnit from './ConfiguratorUnit'
import SummaryUnit from './SummaryUnit'
import ConfiguratorCheckout from './ConfiguratorCheckout'

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
	//  However different types (ie PricingType) of subunits use different property names, so they don't interfere with each other.  They just share a ,optionsIndex (which says which one is active) + maybe configuration
	const unitIndex = productDataArray.findIndex((item) => item.pricingType === PricingType.UNIT)
	const minUnits = unitIndex !== -1 ? productDataArray[unitIndex].minUnits : undefined
	const minUnitYears = unitIndex !== -1 ? productDataArray[unitIndex].minYears : undefined

	const hsIndex = productDataArray.findIndex((item) => item.pricingType === PricingType.HARDSUB)
	const hsDefaultSubFamily = hsIndex !== -1 ? productDataArray[hsIndex].subFamilies[0] : undefined
	const hsDefaultAppliance =
		hsIndex !== -1 ? productDataArray[hsIndex].appliances[hsDefaultSubFamily][0].sku : undefined
	const hsMinYears = unitIndex !== -1 ? productDataArray[unitIndex].minYears : undefined

	const savedData = configuratorData[productFamily] || {
		optionIndex: 0,
		currentlyEditingField: false,

		// PricingType.UNIT
		unType: PurchaseType.SUB,
		unitsExistingLiveUpdate: minUnits,
		unitsExisting: minUnits,
		unitsChangeLiveUpdate: 0,
		unitsChange: 0,
		unitCheckedExtensions: [],
		unYears: minUnitYears,
		unitsChangeError: false,
		unitsExistingError: false,

		// PricingType.HARDSUB
		hsType: PurchaseType.SUB,
		hsSubFamily: hsDefaultSubFamily,
		hsAppliance: hsDefaultAppliance,
		hsHardwareQuantity: 1,
		hsHardwareQuantityLiveUpdate: 1,
		hsHardwareQuantityError: false,
		hsYears: hsMinYears,
		// note: this field is ignored if hsType is set to PurchaseType.WAREX, since that is a type used just to purchase warranty (and doing it this way avoids setting warranty to true if the user selects this option out of curiosity)
		hsWarranty: false,
	}

	const [formData, updateFormData, suppressAriaLivePriceUpdate] = useFormData(savedData)

	const { addToCart } = useContext(CartContext)

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
		addToCart,
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

	//console.log('formData', formData)
	//console.log('currentConfiguration', currentConfiguration)
	//console.log('productDataArray', productDataArray)

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
			{currentConfiguration.summary && (
				<fieldset
					className={`${configuratorStyles.summary} ${
						formData.currentlyEditingField ? configuratorStyles.summaryOutOfDate : ''
					}`}>
					<legend>Summary</legend>
					<div className={configuratorStyles.summaryInnerWrapper}>
						{currentConfiguration.pricingType === PricingType.UNIT ? (
							<SummaryUnit
								configuration={currentConfiguration.summary}
								haveExtensionOptions={productDataArray[formData.optionIndex]?.availableExtensions?.length > 0}
							/>
						) : currentConfiguration.pricingType === PricingType.HARDSUB ? (
							<p>{currentConfiguration.summary.product}</p>
						) : null}
						<ConfiguratorCheckout
							allowAddToCart={
								!formData.currentlyEditingField &&
								!(formData.unType === PurchaseType.EXT && formData?.unitCheckedExtensions?.length === 0)
							}
							haveJustChangedType={suppressAriaLivePriceUpdate}
							addToCartInProgress={addingToCart}
							displayPrice={currentConfiguration.summary.price}
						/>
					</div>
				</fieldset>
			)}
		</form>
	)
}

export default Configurator
