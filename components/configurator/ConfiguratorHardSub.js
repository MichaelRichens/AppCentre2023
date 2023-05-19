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

	/*
		SUB: 'sub', // A renewal of an existing subscription
	NEW: 'new', // A new purchase
	ADD: 'add', // Additional units/users to an existing subscription
	EXT: 'ext', // Additional extension(s) to an existing subscription
	SPARE: 'spare', // Spare hardware (for a customer who has a subscription to the service that uses the hardware)
	WAREX: 'warex', // A warranty extension
	ACC: 'acc', // Accessories*/
	const hsTypeOptions = [
		{ value: PurchaseType.SUB, text: 'Existing Subscription Renewal' },
		{ value: PurchaseType.NEW, text: 'New Control Box & Subscription' },
		{ value: PurchaseType.SPARE, text: 'Spare/Replacement Hardware' },
		{ value: PurchaseType.WAREX, text: 'Extended Warranty' },
		{ value: PurchaseType.ACC, text: 'Accessories' },
	]

	const subFamilyOptions = productData.subFamilies.map((code) => ({ value: code, text: `${code} Series` }))

	return (
		<>
			<fieldset>
				<legend id='typeLegend'>Type of Purchase</legend>
				<SimpleSelect options={hsTypeOptions} value={formData.hsType} onChange={handleHsTypeChange} />
			</fieldset>
			<fieldset>
				{formData.type === PurchaseType.NEW || formData.type === PurchaseType.SPARE || PurchaseType.WAREX ? (
					<legend>Appliance Model</legend>
				) : (
					<>
						<legend>Appliance Series</legend>
						<SimpleSelect options={subFamilyOptions} />
					</>
				)}
			</fieldset>
		</>
	)
}

export default ConfiguratorHardSub
