import React, { useEffect } from 'react'
import SimpleSelect from '../SimpleSelect'
import SimpleInputNumber from '../SimpleInputNumber'
import SimpleCheckboxes from '../SimpleCheckboxes'
import MonthsRemainingSelect from './MonthsRemainingSelect'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import PricingType from '../../utils/types/enums/PricingType'
import {
	createHandleUnitTypeChange,
	createHandleInputChange,
	createHandleInputNumberBlur,
	createHandleCheckboxChange,
	createUpdateFormValueWithFloat,
	createHandleMonthsRemainingChange,
} from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '/styles/Configurator.shared.module.css'

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
	let minUnitsChange
	if (formData.unType === PurchaseType.NEW) {
		minUnitsChange = productData.minUnits
	} else if (formData.unType === PurchaseType.ADD) {
		minUnitsChange = productData.minUnitsStep
	} else {
		minUnitsChange = productData.minUnitsStep - (formData?.unitsExisting || 0)
	}
	const maxUnitsChange = productData.maxUnits - (formData?.unitsExisting || 0)

	const handleTypeChange = createHandleUnitTypeChange(updateFormData, formData, productData)

	const handleUnitsExistingBlur = createHandleInputNumberBlur(
		updateFormData,
		formData,
		'unitsExisting',
		'unitsExistingLiveUpdate',
		'unitsExistingError',
		productData.minUnits,
		productData.maxUnits,
		productData.minUnitsStep
	)

	const handleUnitsExistingChange = createHandleInputChange(
		updateFormData,
		'unitsExistingLiveUpdate',
		handleUnitsExistingBlur
	)

	const handleUnitsChangeBlur = createHandleInputNumberBlur(
		updateFormData,
		formData,
		'unitsChange',
		'unitsChangeLiveUpdate',
		'unitsChangeError',
		minUnitsChange,
		maxUnitsChange,
		productData.minUnitsStep
	)

	const handleUnitsChangeChange = createHandleInputChange(
		updateFormData,
		'unitsChangeLiveUpdate',
		handleUnitsChangeBlur
	)

	const handleExtensionCheckboxChange = createHandleCheckboxChange(updateFormData, formData, 'unitCheckedExtensions')

	const handleYearsChange = createUpdateFormValueWithFloat(updateFormData, 'unYears')

	const handleMonthsRemainingChange = createHandleMonthsRemainingChange(updateFormData)

	const typeOptions = [{ value: PurchaseType.SUB, text: 'Existing Subscription Renewal' }]

	if (productData.allowNewPurchase) {
		typeOptions.push({ value: PurchaseType.NEW, text: 'New Subscription' })
	}
	if (productData.allowAddUnits && productData.maxUnits - productData.minUnits > formData.unitsExisting) {
		typeOptions.push({ value: PurchaseType.ADD, text: `Add ${productData.unitName.pluralC} To Subscription` })
	}
	if (productData.availableExtensions.length > 0) {
		typeOptions.push({ value: PurchaseType.EXT, text: 'Add Extensions to Subscription' })
	}

	let durationInMonths = formData.unType === PurchaseType.ADD || formData.unType === PurchaseType.EXT

	const yearsOptions = Array.from({ length: productData.maxYears - productData.minYears + 1 }, (_, index) => {
		const year = productData.minYears + index
		return {
			value: year,
			text: `${year} Year${year > 1 ? 's' : ''}`,
		}
	})

	useEffect(() => {
		updateFormData({ pricingType: PricingType.UNIT })
	}, [productData])

	return (
		<>
			<fieldset>
				<legend>Type of Purchase</legend>
				{typeOptions.length > 1 ? (
					<SimpleSelect
						name='type'
						options={typeOptions}
						value={formData.unType}
						onChange={handleTypeChange}
						ariaLabel='Type of Purchase'
					/>
				) : (
					<p>{typeOptions[0]?.text}</p>
				)}
			</fieldset>

			<fieldset className={configuratorStyles.unitsInput}>
				<legend>{productData.unitName.pluralC}</legend>
				{(formData.unType === PurchaseType.SUB ||
					formData.unType === PurchaseType.EXT ||
					(formData.unType === PurchaseType.ADD &&
						process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true')) && (
					<SimpleInputNumber
						label={`${formData.unType !== PurchaseType.EXT ? 'Current ' : ''}${
							productData.unitName.pluralC
						} on Subscription`}
						toolTip={
							formData.unType === PurchaseType.SUB
								? `Please enter the number of ${productData.unitName.pluralLC} you currently have on your subscription.`
								: formData.unType === PurchaseType.ADD
								? `The total number of ${productData.unitName.pluralLC} on your subscription currently.`
								: formData.unType === PurchaseType.EXT
								? `The total number of ${productData.unitName.pluralLC} on your subscription - extensions have to be added for all ${productData.unitName.pluralLC} on the subscription.`
								: null
						}
						min={productData.minUnits}
						max={productData.maxUnits}
						step={productData.minUnitsStep}
						value={formData.unitsExistingLiveUpdate}
						onChange={handleUnitsExistingChange}
						onBlur={handleUnitsExistingBlur}
						error={formData.unitsExistingError}
					/>
				)}
				{formData.unType !== PurchaseType.EXT && productData.allowAddUnits && (
					<SimpleInputNumber
						label={
							formData.unType === PurchaseType.NEW
								? `Number of ${productData.unitName.pluralC}`
								: formData.unType === PurchaseType.ADD
								? `${productData.unitName.pluralC} to Add`
								: `Adjust Number of ${productData.unitName.pluralC} by`
						}
						toolTip={
							formData.unType === PurchaseType.SUB
								? `If you want to renew for more or less ${productData.unitName.pluralLC} then your currently have, please enter a positive or negative number here.`
								: formData.unType === PurchaseType.NEW
								? `Please input how many ${productData.unitName.pluralLC} you wish to purchase a subscription for.`
								: formData.unType === PurchaseType.ADD
								? `The number of additional ${productData.unitName.pluralLC} you wish to increase your subscription by.`
								: formData.unType === PurchaseType.EXT
								? `The total number of ${productData.unitName.pluralLC} on your subscription - extensions have to be added for all ${productData.unitName.pluralLC}.`
								: null
						}
						min={
							formData.unType === PurchaseType.SUB
								? productData.minUnits - formData.unitsExisting
								: PurchaseType.ADD
								? productData.minUnitsStep
								: productData.minUnits
						}
						max={productData.maxUnits - formData.unitsExisting}
						step={productData.minUnitsStep}
						value={formData.unitsChangeLiveUpdate}
						onChange={handleUnitsChangeChange}
						onBlur={handleUnitsChangeBlur}
						error={formData.unitsChangeError}
					/>
				)}
			</fieldset>

			{productData.availableExtensions && productData.availableExtensions.length > 0 && (
				<fieldset className={configuratorStyles.checkbox}>
					<legend>
						{formData.unType === PurchaseType.EXT ? (
							<>
								New Extensions to Add<small>Do not include your existing set</small>
							</>
						) : formData.unType === PurchaseType.ADD ? (
							<>
								Extensions on Subscription<small>Must match your current set</small>
							</>
						) : formData.unType === PurchaseType.SUB ? (
							<>
								Select Extensions <small>You can add or remove from your current set</small>
							</>
						) : (
							'Select Extensions'
						)}
					</legend>
					<SimpleCheckboxes
						options={productData.availableExtensions.map((obj) => ({ value: obj.key, text: obj.name }))}
						selected={formData.unitCheckedExtensions}
						onChange={handleExtensionCheckboxChange}
					/>
				</fieldset>
			)}

			{durationInMonths ? (
				<fieldset className={configuratorStyles.monthsRemaining}>
					<legend>Time Remaining Until Renewal Date</legend>
					<MonthsRemainingSelect
						value={formData.unYears}
						onChange={handleMonthsRemainingChange}
						maxYears={productData.maxYears}
					/>
				</fieldset>
			) : (
				<fieldset>
					<legend>Subscription Length</legend>
					{yearsOptions.length > 1 ? (
						<SimpleSelect
							name='years'
							options={yearsOptions}
							value={formData.unYears}
							onChange={handleYearsChange}
							ariaLabel='Subscription Length'
						/>
					) : (
						<p>{yearsOptions[0].text}</p>
					)}
				</fieldset>
			)}
		</>
	)
}

export default ConfiguratorUnit
