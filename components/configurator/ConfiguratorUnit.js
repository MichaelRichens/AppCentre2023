import React from 'react'
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
 * @component
 * Component that sits within a Configurator component (which manages its state)
 * It handles configuration of the PricingType.UNIT type of product
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.productData - Products data from the database for a single productFamily+productOption combination
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @param {Object} props.formData - The object from which to read current form state
 * @param {updateFormDataCallback} props.updateFormData - The function to update form state, passed an object with fields to update (will wipe all errors that are not passed)
 * @param {boolean} props.suppressAriaLivePriceUpdate - State indicating whether aria-live announcements of price changes should be prevented
 * @param {boolean} props.addingToCart - State indicating whether an add to cart operation has been started but not yet completed.
 * @param {ProductConfiguration} props.currentConfiguration - A ProductConfiguration instance holding data on the current configuration
 * @returns {JSX.Element} The rendered component.
 */

const ConfiguratorUnit = ({
	productData,
	unitName,
	formData,
	updateFormData,
	suppressAriaLivePriceUpdate,
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

	const typeOptions = { [PurchaseType.SUB]: 'Existing Subscription Renewal' }
	if (true) {
		// Will need to make this optional for GFI Unlimited - not implemented this yet
		typeOptions[PurchaseType.NEW] = 'New Subscription'
	}
	if (productData.maxUnits - productData.minUnits > formData.existingUnits) {
		typeOptions[PurchaseType.ADD] = `Add ${unitName.pluralC} To Subscription`
	}
	if (productData.availableExtensions.length > 0) {
		typeOptions[PurchaseType.EXT] = 'Add Extensions to Subscription'
	}

	return (
		<>
			<fieldset>
				<legend>Type of Purchase</legend>
				<TypeChangeSelect type={formData.type} typeOptions={typeOptions} onTypeChange={handleTypeChange} />
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
						formData.type === PurchaseType.SUB
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
						{formData.type === PurchaseType.EXT ? (
							'New Extensions to Add'
						) : formData.type === PurchaseType.ADD ? (
							'Extensions You Currently Have'
						) : formData.type === PurchaseType.SUB ? (
							<>
								Select Extensions <small>You can add/remove them as desired</small>
							</>
						) : (
							'Select Extensions'
						)}
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
					haveJustChangedType={suppressAriaLivePriceUpdate}
				/>
			</fieldset>
		</>
	)
}

export default ConfiguratorUnit
