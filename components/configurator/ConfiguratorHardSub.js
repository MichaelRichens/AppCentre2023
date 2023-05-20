import React, { useEffect } from 'react'
import SimpleSelect from '../SimpleSelect'
import SimpleInputNumber from '../SimpleInputNumber'
import SimpleRadio from '../SimpleRadio'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import {
	createUpdateFormValue,
	createUpdateFormValueWithFloat,
	createHandleInputChange,
	createHandleInputNumberBlur,
	createHandleHSApplianceChange,
	createHandleHSSubFamilyChange,
	createHandleHSTypeChange,
} from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * @component
 * Component that sits within a Configurator component (which manages its state)
 * It handles configuration of the PricingType.HARDSUB type of product
 * @returns {JSX.Element} The rendered component.
 */
const ConfiguratorHardSub = ({ updateFormData, formData, productData }) => {
	const handleHsTypeChange = createHandleHSTypeChange(updateFormData, formData, productData)
	const handleHsSubFamilyChange = createHandleHSSubFamilyChange(updateFormData, productData)
	const handleApplianceTypeChange = createHandleHSApplianceChange(updateFormData, productData)
	const handleApplianceQuantityChange = createHandleInputChange(updateFormData, 'hsHardwareQuantityLiveUpdate')
	const handleApplianceQuantityBlur = createHandleInputNumberBlur(
		updateFormData,
		formData,
		'hsHardwareQuantity',
		'hsHardwareQuantityLiveUpdate',
		'hsHardwareQuantityError',
		1,
		productData.maxHardwareUnits
	)
	const handleHSYearsChange = createUpdateFormValueWithFloat(updateFormData, 'hsYears')
	const handleWarrantyChange = createUpdateFormValue(updateFormData, 'hsWarranty')

	const hsTypeOptions = [
		{ value: PurchaseType.SUB, text: 'Existing Subscription Renewal' },
		{ value: PurchaseType.NEW, text: 'New Control Box & Subscription' },
		{ value: PurchaseType.SPARE, text: 'Spare/Replacement Hardware' },
		{ value: PurchaseType.WAREX, text: 'Extended Warranty' },
		{ value: PurchaseType.ACC, text: 'Accessories' },
	]

	const appliances = Object.values(productData.appliances).flatMap((arr) =>
		arr.map((item) => ({ value: item.sku, text: item.name }))
	)

	const subFamilyOptions = productData.subFamilies.map((code) => ({ value: code, text: `${code} Series` }))

	const yearsOptions = Array.from({ length: productData.maxYears - productData.minYears + 1 }, (_, index) => {
		const year = productData.minYears + index
		return {
			value: year,
			text: `${year} Year${year > 1 ? 's' : ''}`,
		}
	})

	const offerExtendedWarranty =
		(formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.SPARE) &&
		!!productData.appliances[formData.hsSubFamily]?.find((item) => item.sku === formData.hsAppliance)?.extendedWarranty

	const warrantyOptions = [
		{ value: false, text: '1 Year' },
		{ value: true, text: '3 Years' },
	]

	const offerAccessories =
		(formData.hsType === PurchaseType.ACC ||
			formData.hsType === PurchaseType.NEW ||
			formData.hsType === PurchaseType.SPARE) &&
		productData?.accessories[formData.hsSubFamily]?.length > 0

	return (
		<>
			<fieldset>
				<legend id='typeLegend'>Type of Purchase</legend>
				<SimpleSelect options={hsTypeOptions} value={formData.hsType} onChange={handleHsTypeChange} />
			</fieldset>
			<fieldset>
				{formData.hsType === PurchaseType.NEW ||
				formData.hsType === PurchaseType.SPARE ||
				formData.hsType === PurchaseType.WAREX ? (
					<>
						<legend>Appliances</legend>
						<SimpleSelect options={appliances} value={formData.hsAppliance} onChange={handleApplianceTypeChange} />

						{(formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.SPARE) && (
							<SimpleInputNumber
								label='Number of Appliances'
								min='1'
								max={productData.maxHardwareUnits}
								value={formData.hsHardwareQuantityLiveUpdate}
								onChange={handleApplianceQuantityChange}
								onBlur={handleApplianceQuantityBlur}
								error={formData.hsHardwareQuantityError}
							/>
						)}
						{formData.hsType === PurchaseType.NEW && (
							<p>Additional units are supplied for use as spares or for testing.</p>
						)}
					</>
				) : (
					<>
						<legend>Appliance Series</legend>
						<SimpleSelect
							options={subFamilyOptions.filter(
								(subFamily) =>
									formData.hsType === PurchaseType.SUB || productData.accessories[subFamily.value].length > 0
							)}
							value={formData.hsSubFamily}
							onChange={handleHsSubFamilyChange}
						/>
					</>
				)}
			</fieldset>
			{(formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.SUB) && (
				<fieldset>
					<legend>Subscription Length</legend>
					<SimpleSelect
						name='hsYears'
						options={yearsOptions}
						value={formData.hsYears}
						onChange={handleHSYearsChange}
						ariaLabel='Subscription Length'
					/>
				</fieldset>
			)}
			{offerExtendedWarranty && (
				<fieldset className={configuratorStyles.extendedWarranty}>
					<legend>Hardware Warranty</legend>
					<SimpleRadio
						name='hsWarranty'
						onChange={handleWarrantyChange}
						value={formData.hsWarranty}
						options={warrantyOptions}
					/>
				</fieldset>
			)}
			{offerAccessories && (
				<fieldset className={configuratorStyles.checkbox}>
					<legend>Accessories</legend>
				</fieldset>
			)}
		</>
	)
}

export default ConfiguratorHardSub
