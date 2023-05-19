import React, { useEffect } from 'react'
import SimpleSelect from '../SimpleSelect'
import SubscriptionSummary from './SubscriptionSummary'
import PurchaseUnitInput from './PurchaseUnitInput'
import ExtensionCheckboxes from './ExtensionCheckboxes'
import MonthsRemainingSelect from './MonthsRemainingSelect'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import {
	createHandleUnitTypeChange,
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
 * @component
 * Component that sits within a Configurator component (which manages its state)
 * It handles configuration of the PricingType.UNIT type of product
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.productData - Products data from the database for a single productFamily+productOption combination
 * @param {Object} props.formData - The object from which to read current form state
 * @param {updateFormDataCallback} props.updateFormData - The function to update form state, passed an object with fields to update (will wipe all errors that are not passed)
 * @returns {JSX.Element} The rendered component.
 */

const ConfiguratorUnit = ({ productData, formData, updateFormData }) => {
	useEffect(() => {
		const unitState = {}
		if (
			formData.unType !== PurchaseType.SUB &&
			formData.unType !== PurchaseType.NEW &&
			formData.unType !== PurchaseType.ADD &&
			formData.unType !== PurchaseType.EXT
		) {
			unitState.unType = PurchaseType.SUB
			if (formData.existingUnits < productData.minUnits || formData.existingUnits > formData.maxUnits) {
				unitState.existingUnits = productData.minUnits
				unitState.existingUnitsLiveUpdate = productData.minUnits
			}
		}

		unitState.validState = true

		updateFormData(unitState)
	}, [])

	const handleTypeChange = createHandleUnitTypeChange(updateFormData, formData, productData)

	const handleExistingUnitsChange = createHandleExistingUnitsChange(updateFormData)

	const handleExistingUnitsBlur = createHandleExistingUnitsBlur(updateFormData, formData, productData)

	const handleUnitsChangeChange = createHandleUnitsChangeChange(updateFormData, formData)

	const handleUnitsChangeBlur = createHandleUnitsChangeBlur(updateFormData, formData, productData)

	const handleExtensionCheckboxChange = createHandleExtensionCheckboxChange(updateFormData, formData)

	const handleYearsChange = createHandleYearsChange(updateFormData)

	const handleMonthsRemainingChange = createHandleMonthsRemainingChange(updateFormData)

	let durationType = 'years'
	let durationClass = null
	if (formData.unType === PurchaseType.ADD || formData.unType === PurchaseType.EXT) {
		durationType = 'months'
		durationClass = configuratorStyles.monthsRemaining
	}

	const typeOptions = [{ value: PurchaseType.SUB, text: 'Existing Subscription Renewal' }]

	if (true) {
		// Will need to make this optional for GFI Unlimited - not implemented this yet
		typeOptions.push({ value: PurchaseType.NEW, text: 'New Subscription' })
	}
	if (productData.maxUnits - productData.minUnits > formData.existingUnits) {
		typeOptions.push({ value: PurchaseType.ADD, text: `Add ${productData.unitName.pluralC} To Subscription` })
	}
	if (productData.availableExtensions.length > 0) {
		typeOptions.push({ value: PurchaseType.EXT, text: 'Add Extensions to Subscription' })
	}

	const yearsOptions = Array.from({ length: productData.maxYears - productData.minYears + 1 }, (_, index) => {
		const year = productData.minYears + index
		return {
			value: year,
			text: `${year} Year${year > 1 ? 's' : ''}`,
		}
	})

	return (
		<>
			<fieldset>
				<legend>Type of Purchase</legend>
				<SimpleSelect
					name='type'
					options={typeOptions}
					value={formData.unType}
					onChange={handleTypeChange}
					ariaLabel='Type of Purchase'
				/>
			</fieldset>

			<fieldset>
				<legend>{productData.unitName.pluralC}</legend>
				<PurchaseUnitInput
					allowDisplay={
						formData.unType === PurchaseType.SUB ||
						formData.unType === PurchaseType.EXT ||
						(formData.unType === PurchaseType.ADD &&
							process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true')
					}
					label={`${formData.unType !== PurchaseType.EXT ? 'Current ' : ''}${
						productData.unitName.pluralC
					} on Subscription`}
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
					allowDisplay={formData.unType !== PurchaseType.EXT}
					label={
						formData.unType === PurchaseType.NEW
							? `Number of ${productData.unitName.pluralC}`
							: formData.unType === PurchaseType.ADD
							? `${productData.unitName.pluralC} to Add`
							: `Adjust Number of ${productData.unitName.pluralC} by`
					}
					min={
						formData.unType === PurchaseType.SUB
							? productData.minUnits - formData.existingUnits
							: PurchaseType.ADD
							? productData.minUnitsStep
							: productData.minUnits
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
						{formData.unType === PurchaseType.EXT ? (
							'New Extensions to Add'
						) : formData.unType === PurchaseType.ADD ? (
							'Extensions You Currently Have'
						) : formData.unType === PurchaseType.SUB ? (
							<>
								Select Extensions <small>You can add/remove them as desired</small>
							</>
						) : (
							'Select Extensions'
						)}
					</legend>
					<ExtensionCheckboxes
						availableExtensions={productData.availableExtensions}
						selectedExtensions={formData.unitCheckedExtensions}
						onChange={handleExtensionCheckboxChange}
					/>
				</fieldset>
			)}

			<fieldset className={durationClass}>
				{durationType === 'years' ? (
					<>
						<legend>Subscription Length</legend>
						<SimpleSelect
							name='years'
							options={yearsOptions}
							value={formData.years}
							onChange={handleYearsChange}
							ariaLabel='Subscription Length'
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
		</>
	)
}

export default ConfiguratorUnit
