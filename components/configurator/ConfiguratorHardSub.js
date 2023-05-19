import React, { useEffect } from 'react'
import SimpleSelect from '../SimpleSelect'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import { createUpdateFormValue } from '../../utils/configuratorHandleFunctions'

import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * @component
 * Component that sits within a Configurator component (which manages its state)
 * It handles configuration of the PricingType.HARDSUB type of product
 * @returns {JSX.Element} The rendered component.
 */
const ConfiguratorHardSub = ({ updateFormData, formData, productData }) => {
	const handleHsTypeChange = createUpdateFormValue(updateFormData, 'hsType')

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
	console.log('subFamilyOptions', subFamilyOptions)
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
						<SimpleSelect options={appliances} />
					</>
				) : (
					<>
						<legend>Appliance Series</legend>
						<SimpleSelect
							options={subFamilyOptions.filter(
								(subFamily) =>
									formData.hsType === PurchaseType.SUB || productData.accessories[subFamily.value].length > 0
							)}
						/>
					</>
				)}
			</fieldset>
		</>
	)
}

export default ConfiguratorHardSub
