import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from '../contexts/ConfiguratorContext'
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
} from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * @warning Do not have more than 1 of these components rendered with the same productFamily at the same time, they will not share data properly since they only read from ConfiguratorContext on rerender.
 * @component
 * SubscriptionConfigurator is a component that allows users to configure a their subscription
 * It generates a subscription for the software product with the passed productFamily
 * Form data is stored in the app level ConfiguratorContext, keyed by productFamily
 * It is customised with the passed productData.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.productFamily - The identifier for the product family.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @returns {JSX.Element} The rendered component.
 */

const ConfiguratorWithUnits = ({
	productData,
	unitName,
	formData,
	updateFormData,
	lastChangeWasType,
	addingToCart,
	currentConfiguration,
}) => {
	const handleTypeChange = createHandleTypeChange(updateFormData, formData, productData)

	const handleExistingUnitsChange = createHandleExistingUnitsChange(updateFormData)

	const handleExistingUnitsBlur = createHandleExistingUnitsBlur(updateFormData, formData, productData)

	const handleUnitsChangeChange = createHandleUnitsChangeChange(updateFormData, formData)

	const handleUnitsChangeBlur = createHandleUnitsChangeBlur(updateFormData, formData, productData)

	const handleExtensionCheckboxChange = createHandleExtensionCheckboxChange(updateFormData, formData)

	const handleYearsChange = createHandleYearsChange(updateFormData)

	const handleMonthsRemainingChange = createHandleMonthsRemainingChange(updateFormData)

	let durationType = 'years'
	let durationClass = null
	if (formData.type === PurchaseType.ADD || formData.type === PurchaseType.EXT) {
		durationType = 'months'
		durationClass = configuratorStyles.monthsRemaining
	}

	return (
		<>
			<fieldset>
				<legend>Type of Purchase</legend>
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
			</fieldset>

			<fieldset>
				<legend>{unitName.pluralC}</legend>
				<PurchaseUnitInput
					allowDisplay={
						formData.type === PurchaseType.SUB ||
						formData.type === PurchaseType.EXT ||
						(formData.type === PurchaseType.ADD &&
							process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true')
					}
					label={`${formData.type !== PurchaseType.EXT ? 'Current ' : ''}${unitName.pluralC} on Subscription`}
					min={productData.minUnits}
					max={productData.maxUnits}
					step={productData.minUnitsStep}
					name='existingUnits'
					value={formData.existingUnitsLiveUpdate}
					onChange={handleExistingUnitsChange}
					onBlur={handleExistingUnitsBlur}
					error={formData.existingUnitsError}
				/>
				<PurchaseUnitInput
					allowDisplay={formData.type !== PurchaseType.EXT}
					label={
						formData.type === PurchaseType.NEW
							? `Number of ${unitName.pluralC}`
							: formData.type === PurchaseType.ADD
							? `${unitName.pluralC} to Add`
							: `Adjust Number of ${unitName.pluralC} by`
					}
					min={
						formData.type === PurchaseType.SUB ? productData.minUnits - formData.existingUnits : productData.minUnits
					}
					max={productData.maxUnits - formData.existingUnits}
					step={productData.minUnitsStep}
					name='unitsChange'
					value={formData.unitsChangeLiveUpdate}
					onChange={handleUnitsChangeChange}
					onBlur={handleUnitsChangeBlur}
					error={formData.unitsChangeError}
				/>
			</fieldset>

			{productData.availableExtensions && productData.availableExtensions.length > 0 && (
				<fieldset className={configuratorStyles.checkbox}>
					<legend>
						{formData.type === PurchaseType.EXT
							? 'New Extensions to Add'
							: formData.type === PurchaseType.ADD
							? 'Extensions You Currently Have'
							: 'Select Extensions'}
					</legend>
					<ExtensionCheckboxes
						availableExtensions={productData.availableExtensions}
						selectedExtensions={formData.checkedExtensions}
						onChange={handleExtensionCheckboxChange}
					/>
				</fieldset>
			)}

			<fieldset className={durationClass}>
				{durationType === 'years' ? (
					<>
						<legend>Subscription Length</legend>
						<YearsSelect
							value={formData.years}
							onChange={handleYearsChange}
							from={productData.minYears}
							to={productData.maxYears}
						/>
					</>
				) : (
					<>
						<legend>Time Remaining Until Renewal Date</legend>
						<MonthsRemainingSelect
							value={formData.years}
							onChange={handleMonthsRemainingChange}
							maxYears={productData.maxYears}
						/>
					</>
				)}
			</fieldset>

			<fieldset className={configuratorStyles.summary}>
				<legend>Summary</legend>
				<SubscriptionSummary
					allowAddToCart={!(formData.type === PurchaseType.EXT && formData.checkedExtensions.length === 0)}
					configuration={currentConfiguration.summary}
					haveExtensionOptions={productData.availableExtensions.length > 0}
					addToCartInProgress={addingToCart}
					haveJustChangedType={lastChangeWasType}
				/>
			</fieldset>
		</>
	)
}

export default ConfiguratorWithUnits
