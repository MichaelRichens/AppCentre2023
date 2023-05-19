import React, { useEffect } from 'react'
import SimpleSelect from '../SimpleSelect'
import SimpleRadio from '../SimpleRadio'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import {
	createUpdateFormValue,
	createHandleHSApplianceChange,
	createHandleHSSubFamilyChange,
} from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * @component
 * Component that sits within a Configurator component (which manages its state)
 * It handles configuration of the PricingType.HARDSUB type of product
 * @returns {JSX.Element} The rendered component.
 */
const ConfiguratorHardSub = ({ updateFormData, formData, productData }) => {
	const handleHsTypeChange = createUpdateFormValue(updateFormData, 'hsType')
	const handleHsSubFamilyChange = createHandleHSSubFamilyChange(updateFormData, productData)
	const handleApplianceTypeChange = createHandleHSApplianceChange(updateFormData, productData)
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

	const extendedWarrantyAvailable = !!productData.appliances[formData.hsSubFamily]?.find(
		(item) => item.sku === formData.hsAppliance
	)?.extendedWarranty

	console.log('extendedWarrantyAvailable', extendedWarrantyAvailable)

	const warrantyOptions = [
		{ value: false, text: '1 Year' },
		{ value: true, text: '3 Years' },
	]

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
						<legend>Appliance Model</legend>
						<SimpleSelect options={appliances} value={formData.hsAppliance} onChange={handleApplianceTypeChange} />
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
			{(formData.hsType === PurchaseType.NEW || formData.hsType === PurchaseType.SPARE) &&
				extendedWarrantyAvailable && (
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
