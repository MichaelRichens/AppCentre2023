import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from './contexts/ConfiguratorContext'
import SubscriptionSummary from './configurator/SubscriptionSummary'
import TypeChangeSelect from './configurator/TypeChangeSelect'
import PurchaseUnitInput from './configurator/PurchaseUnitInput'
import ExtensionCheckboxes from './configurator/ExtensionCheckboxes'
import YearsSelect from './configurator/YearsSelect'
import MonthsRemainingSelect from './configurator/MonthsRemainingSelect'
import Word from '../utils/types/Word'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import PurchaseType from '../utils/types/enums/PurchaseType'
import {
	createHandleTypeChange,
	createHandleExistingUsersBlur,
	createHandleExistingUsersChange,
	createHandleUserChangeChange,
	createHandleUserChangeBlur,
	createHandleExtensionCheckboxChange,
	createHandleYearsChange,
	createHandleMonthsRemainingChange,
} from '../utils/configuratorHandleFunctions'
import processConfiguration from '../utils/processConfiguration'
import configuratorStyles from '../styles/Configurator.shared.module.css'

/**
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
		existingUsers: productData.minUsers,
		userChange: 0,
		checkedExtensions: [],
		years: productData.minYears,
		userChangeError: false,
		existingUsersError: false,
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
		const errorFields = ['existingUsersError', 'userChangeError']

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

	useEffect(() => {
		saveConfiguratorData(productFamily, formData)
	}, [formData])

	const currentConfiguration = processConfiguration(
		productName,
		productData.products,
		productData.extensions,
		formData,
		unitName
	)

	const handleTypeChange = createHandleTypeChange(updateFormData, formData, productData)

	const handleExistingUsersChange = createHandleExistingUsersChange(updateFormData)

	const handleExistingUsersBlur = createHandleExistingUsersBlur(updateFormData, formData, productData)

	const handleUserChangeChange = createHandleUserChangeChange(updateFormData, formData)

	const handleUserChangeBlur = createHandleUserChangeBlur(updateFormData, formData, productData)

	const handleExtensionCheckboxChange = createHandleExtensionCheckboxChange(updateFormData, formData)

	const handleYearsChange = createHandleYearsChange(updateFormData)

	const handleMonthsRemainingChange = createHandleMonthsRemainingChange(updateFormData)

	return (
		<form className={configuratorStyles.configurator}>
			<SubscriptionSummary configuration={currentConfiguration.summary} />

			<TypeChangeSelect
				type={formData.type}
				addUserOption={
					productData.maxUsers - productData.minUsers > formData.existingUsers
						? `Add ${unitName.pluralC} To Subscription`
						: false
				}
				addExtOption={productData.availableExtensions.length > 0 ? 'Add Extensions to Subscription' : false}
				onTypeChange={handleTypeChange}
			/>

			<PurchaseUnitInput
				allowDisplay={
					formData.type === PurchaseType.SUB ||
					formData.type === PurchaseType.EXT ||
					(formData.type === PurchaseType.ADD &&
						process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_USERS === 'true')
				}
				legend={`${formData.type !== PurchaseType.EXT ? 'Current ' : ''}${unitName.pluralC} on Subscription`}
				min={productData.minUsers}
				max={productData.maxUsers}
				step={productData.minUsers}
				name='existingUsers'
				value={formData.existingUsers}
				onChange={handleExistingUsersChange}
				onBlur={handleExistingUsersBlur}
				error={formData.existingUsersError}
			/>

			<PurchaseUnitInput
				allowDisplay={formData.type !== PurchaseType.EXT}
				legend={
					formData.type === PurchaseType.NEW
						? `Number of ${unitName.pluralC}`
						: formData.type === PurchaseType.ADD
						? `${unitName.pluralC} to Add`
						: `Adjust Number of ${unitName.pluralC} By`
				}
				min={formData.type === PurchaseType.SUB ? productData.minUsers - formData.existingUsers : productData.minUsers}
				max={productData.maxUsers - formData.existingUsers}
				step={productData.minUsers}
				name='userChange'
				value={formData.userChange}
				onChange={handleUserChangeChange}
				onBlur={handleUserChangeBlur}
				error={formData.userChangeError}
			/>

			<ExtensionCheckboxes
				legend={formData.type === PurchaseType.EXT ? 'New Extensions to Add' : 'Select Extensions'}
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
