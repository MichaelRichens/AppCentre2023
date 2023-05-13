import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
import { useShoppingCart } from 'use-shopping-cart'
import SubscriptionSummary from './SubscriptionSummary'
import TypeChangeSelect from './TypeChangeSelect'
import PurchaseUnitInput from './PurchaseUnitInput'
import ExtensionCheckboxes from './ExtensionCheckboxes'
import YearsSelect from './YearsSelect'
import MonthsRemainingSelect from './MonthsRemainingSelect'
import Word from '../../utils/types/Word'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import {
	createHandleTypeChange,
	createHandleExistingUnitsBlur,
	createHandleExistingUnitsChange,
	createHandleUnitsChangeChange,
	createHandleUnitsChangeBlur,
	createHandleExtensionCheckboxChange,
	createHandleYearsChange,
	createHandleMonthsRemainingChange,
	createAsyncHandleSubmit,
} from '../../utils/configuratorHandleFunctions'
import processConfiguration from '../../utils/processConfiguration'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * @warning Do not have more than 1 of these components rendered with the same productFamily at the same time, they will not share data properly since they only read from ConfiguratorContext on rerender.
 * @component
 * SubscriptionConfigurator is a component that allows users to configure a their subscription
 * It generates a subscription for the software product with the passed productFamily
 * Form data is stored in the app level ConfiguratorContext, keyed by productFamily
 * It is customised with the passed productName.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.productName - The name of the product to be configured.
 * @param {string} props.productFamily - The identifier for the product family.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @returns {JSX.Element} The rendered component.
 */

const SubscriptionConfigurator = ({ productName, productFamily, productData, unitName }) => {
	const { configuratorData, saveConfiguratorData } = useConfiguratorContext()

	const savedData = configuratorData[productFamily] || {
		type: PurchaseType.SUB,
		existingUnits: productData.minUnits,
		unitsChange: 0,
		checkedExtensions: [],
		years: productData.minYears,
		unitsChangeError: false,
		existingUnitsError: false,
	}

	const [formData, setFormData] = useState(savedData)
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

	const { addItem } = useShoppingCart()

	const currentConfiguration = processConfiguration(
		productName,
		productData.products,
		productData.extensions,
		formData,
		unitName
	)

	const handleTypeChange = createHandleTypeChange(updateFormData, formData, productData)

	const handleExistingUnitsChange = createHandleExistingUnitsChange(updateFormData)

	const handleExistingUnitsBlur = createHandleExistingUnitsBlur(updateFormData, formData, productData)

	const handleUnitsChangeChange = createHandleUnitsChangeChange(updateFormData, formData)

	const handleUnitsChangeBlur = createHandleUnitsChangeBlur(updateFormData, formData, productData)

	const handleExtensionCheckboxChange = createHandleExtensionCheckboxChange(updateFormData, formData)

	const handleYearsChange = createHandleYearsChange(updateFormData)

	const handleMonthsRemainingChange = createHandleMonthsRemainingChange(updateFormData)

	const asyncHandleSubmit = createAsyncHandleSubmit(productFamily, unitName, formData, addItem, setAddingToCart)

	return (
		<form className={configuratorStyles.configurator} onSubmit={asyncHandleSubmit}>
			<TypeChangeSelect
				type={formData.type}
				addUserOption={
					productData.maxUnits - productData.minUnits > formData.existingUnits
						? `Add ${unitName.pluralC} To Subscription`
						: false
				}
				addExtOption={productData.availableExtensions.length > 0 ? 'Add Extensions to Subscription' : false}
				onTypeChange={handleTypeChange}
			/>

			<SubscriptionSummary
				configuration={currentConfiguration.summary}
				haveExtensionOptions={productData.availableExtensions.length > 0}
				addToCartInProgress={addingToCart}
			/>

			<PurchaseUnitInput
				allowDisplay={
					formData.type === PurchaseType.SUB ||
					formData.type === PurchaseType.EXT ||
					(formData.type === PurchaseType.ADD &&
						process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true')
				}
				legend={`${formData.type !== PurchaseType.EXT ? 'Current ' : ''}${unitName.pluralC} on Subscription`}
				min={productData.minUnits}
				max={productData.maxUnits}
				step={productData.minUnits}
				name='existingUnits'
				value={formData.existingUnits}
				onChange={handleExistingUnitsChange}
				onBlur={handleExistingUnitsBlur}
				error={formData.existingUnitsError}
			/>

			<PurchaseUnitInput
				allowDisplay={formData.type !== PurchaseType.EXT}
				legend={
					formData.type === PurchaseType.NEW
						? `Number of ${unitName.pluralC}`
						: formData.type === PurchaseType.ADD
						? `${unitName.pluralC} to Add`
						: `Adjust Number of ${unitName.pluralC} by`
				}
				min={formData.type === PurchaseType.SUB ? productData.minUnits - formData.existingUnits : productData.minUnits}
				max={productData.maxUnits - formData.existingUnits}
				step={productData.minUnits}
				name='unitsChange'
				value={formData.unitsChange}
				onChange={handleUnitsChangeChange}
				onBlur={handleUnitsChangeBlur}
				error={formData.unitsChangeError}
			/>

			<ExtensionCheckboxes
				legend={
					formData.type === PurchaseType.EXT
						? 'New Extensions to Add'
						: formData.type === PurchaseType.ADD
						? 'Extensions You Currently Have'
						: 'Select Extensions'
				}
				availableExtensions={productData.availableExtensions}
				selectedExtensions={formData.checkedExtensions}
				onChange={handleExtensionCheckboxChange}
			/>

			{formData.type === PurchaseType.SUB || formData.type === PurchaseType.NEW ? (
				<YearsSelect
					legend='Subscription Length'
					value={formData.years}
					onChange={handleYearsChange}
					from={productData.minYears}
					to={productData.maxYears}
				/>
			) : (
				<MonthsRemainingSelect
					legend='Time Remaining Until Renewal Date'
					value={formData.years}
					onChange={handleMonthsRemainingChange}
					maxYears={productData.maxYears}
				/>
			)}
		</form>
	)
}

export default SubscriptionConfigurator
