import React, { useEffect } from 'react'
import useUniqueId from '../hooks/useUniqueId'
import SimpleSelect from '../SimpleSelect'
import SimpleInputNumber from '../SimpleInputNumber'
import SimpleRadio from '../SimpleRadio'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import PricingType from '../../utils/types/enums/PricingType'
import {
	createUpdateFormValue,
	createUpdateFormValueWithFloat,
	createHandleInputChange,
	createHandleInputNumberBlur,
	createHandleHSApplianceChange,
	createHandleHSSubFamilyChange,
	createHandleHSTypeChange,
} from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '/styles/Configurator.shared.module.css'

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

	const handleApplianceQuantityBlur = createHandleInputNumberBlur(
		updateFormData,
		formData,
		'hsHardwareQuantity',
		'hsHardwareQuantityLiveUpdate',
		'hsHardwareQuantityError',
		1,
		productData.maxHardwareUnits
	)

	const handleApplianceQuantityChange = createHandleInputChange(
		updateFormData,
		'hsHardwareQuantityLiveUpdate',
		handleApplianceQuantityBlur
	)

	const handleHSYearsChange = createUpdateFormValueWithFloat(updateFormData, 'hsYears')
	const handleWarrantyChange = createUpdateFormValue(updateFormData, 'hsWarranty')

	const qtyTextId = useUniqueId('appQ')

	const hsTypeOptions = [
		{ value: PurchaseType.SUB, text: 'Existing Subscription Renewal' },
		{ value: PurchaseType.NEW, text: 'New Control Box & Subscription' },
		{ value: PurchaseType.SPARE, text: 'Spare/Replacement Hardware' },
		{ value: PurchaseType.WAREX, text: 'Extended Warranty' },
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

	const extendedWarrantyDuration = productData.appliances?.[formData.hsSubFamily].find(
		(appliance) => appliance.sku === formData.hsAppliance
	)?.extendedWarranty.years

	const warrantyOptions =
		extendedWarrantyDuration > 0
			? [
					{ value: false, text: '1 Year' },
					{ value: true, text: `${extendedWarrantyDuration + 1} Years` },
			  ]
			: false

	useEffect(() => {
		updateFormData({ pricingType: PricingType.HARDSUB })
	}, [productData])

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
						<SimpleInputNumber
							label='Number of Appliances'
							min='1'
							max={productData.maxHardwareUnits}
							value={formData.hsHardwareQuantityLiveUpdate}
							onChange={handleApplianceQuantityChange}
							onBlur={handleApplianceQuantityBlur}
							error={formData.hsHardwareQuantityError}
							ariaDescribedBy={
								formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.WAREX ? qtyTextId : undefined
							}
							toolTip={
								formData.hsType === PurchaseType.NEW
									? 'Additional units are supplied for use as spares or for testing. If you want multiple boxes with their own subscriptions, please add them to your cart separately.'
									: formData.hsType === PurchaseType.WAREX
									? 'You can extend the warranty for appliances you own that are within their original warranty.'
									: null
							}
						/>
					</>
				) : (
					<>
						<legend>Appliance Series</legend>
						<SimpleSelect options={subFamilyOptions} value={formData.hsSubFamily} onChange={handleHsSubFamilyChange} />
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
			{(formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.SPARE) && warrantyOptions && (
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
		</>
	)
}

export default ConfiguratorHardSub
