import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from './contexts/ConfiguratorContext'
import SubscriptionSummary from './configurator/SubscriptionSummary'
import TypeChangeSelect from './configurator/TypeChangeSelect'
import PurchaseUnitInput from './configurator/PurchaseUnitInput'
import ExtensionCheckboxes from './configurator/ExtensionCheckboxes'
import YearsSelect from './configurator/YearsSelect'
import Word from '../utils/types/word'
import generateSkusAndCalculatePrice from '../utils/generateSkusAndCalculatePrice'
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

const SubscriptionConfigurator = ({
  productName,
  productFamily,
  productData,
  unitName,
}) => {
  const { configuratorData, saveConfiguratorData } = useConfiguratorContext()
  const savedData = configuratorData[productFamily] || {
    type: 'sub',
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

  const haveAnyExtensions = productData.availableExtensions.length > 0

  const handleInputChange = (event) => {
    const { name, value } = event.target
    updateFormData({
      [name]: value,
    })
  }

  const handleTypeChange = (event) => {
    const { value } = event.target
    let userChange = formData.userChange
    if (
      (value === 'new' || value === 'add') &&
      userChange < productData.minUsers
    ) {
      userChange = productData.minUsers
    } else if (
      value === 'sub' &&
      (formData.type === 'new' || formData.type === 'add')
    ) {
      userChange = 0
    }
    updateFormData({
      type: value,
      userChange: userChange,
    })
  }

  const handleExistingUsersChange = (event) => {
    const { value } = event.target
    if (isNaN(value)) {
      return
    }
    updateFormData({
      existingUsers: value == '' ? '' : parseInt(value),
    })
  }

  const handleExistingUsersBlur = (event) => {
    console.log(event.target)
    const { value } = event.target
    let existingUsersError = false
    if (isNaN(value) || value == '') {
      updateFormData({
        existingUsers: productData.minUsers,
      })
      return
    } else {
      let existingUsers = Math.min(
        Math.max(parseInt(event.target.value), 1),
        productData.maxUsers
      )
      if (formData.type === 'sub') {
        const remainder = existingUsers % productData.minUsers
        if (remainder !== 0) {
          existingUsers += productData.minUsers - remainder
          existingUsersError = `Must be renewed in blocks of ${productData.minUsers}.`
        }
      }
      updateFormData({
        existingUsers: existingUsers,
        existingUsersError: existingUsersError,
      })
    }
  }

  const handleUserChangeChange = (event) => {
    const { value } = event.target
    if (isNaN(value) && (formData.type != 'sub' || value != '-')) {
      return
    }
    let userChange
    if (value == '' || value == '-') {
      userChange = value
    } else {
      userChange = parseInt(value)
    }
    updateFormData({
      userChange: userChange,
    })
  }

  const handleUserChangeBlur = (event) => {
    const { value } = event.target
    if (isNaN(value)) {
      updateFormData({
        userChange: formData.type == 'add' ? productData.minUserChange : 0,
      })
    } else {
      const { userChange, userChangeError } = calculateUserChange(
        parseInt(event.target.value)
      )
      updateFormData({
        userChange: userChange,
        userChangeError: userChangeError,
      })
    }
  }

  const calculateUserChange = (value) => {
    let userChangeError = false
    // Parse the user input as an integer.
    let userChange = !isNaN(parseInt(value)) ? parseInt(value) : 0
    // Calculate the minimum and maximum user change values based on the type of subscription.
    const minUserChange =
      formData.type === 'new' || formData.type === 'add'
        ? productData.minUsers
        : productData.minUsers - formData.existingUsers
    const maxUserChange = productData.maxUsers - formData.existingUsers
    const userChangeBeforeClamp = userChange
    // Clamp the userChange value to be between minUserChange and maxUserChange.
    userChange = Math.min(Math.max(userChange, minUserChange), maxUserChange)
    if (userChange !== userChangeBeforeClamp) {
      if (userChange === minUserChange) {
        userChangeError = `Minimum Allowed Value: ${minUserChange}`
      } else if (userChange == maxUserChange) {
        userChangeError = `Maximum Allowed Value ${maxUserChange}`
      }
    }

    // Calculate the remainder of userChange when divided by productData.minUsers.
    const remainder = userChange % productData.minUsers

    // If the remainder is not 0, it means the userChange value is not divisible by productData.minUsers.
    // Positive remainder means positive number (adding users), negative remainder is removing users.
    if (remainder > 0) {
      userChange += productData.minUsers - remainder
      userChangeError = `Must be changed in steps of ${productData.minUsers}`
    } else if (remainder < 0) {
      userChange -= remainder
      userChangeError = `Must be changed in steps of ${productData.minUsers}`
    }

    // Return the final userChange value.
    return { userChange: userChange, userChangeError: userChangeError }
  }

  const handleExtensionCheckboxChange = (event) => {
    const { value, checked } = event.target
    let newCheckedExtensions = [...formData.checkedExtensions]
    if (checked) {
      newCheckedExtensions.push(value)
    } else {
      newCheckedExtensions = newCheckedExtensions.filter(
        (extensionKey) => extensionKey !== value
      )
    }
    updateFormData({ checkedExtensions: newCheckedExtensions })
  }

  const { price } = generateSkusAndCalculatePrice(
    productData.products,
    productData.extensions,
    savedData
  )

  return (
    <form className={configuratorStyles.configurator}>
      <SubscriptionSummary
        productName={productName}
        price={price}
        formData={formData}
        unitName={unitName}
      />

      <TypeChangeSelect
        type={formData.type}
        addOption={
          productData.maxUsers - productData.minUsers > formData.existingUsers
            ? `Add ${unitName.pluralC} To Subscription`
            : false
        }
        onTypeChange={handleTypeChange}
      />

      <PurchaseUnitInput
        allowDisplay={formData.type !== 'new'}
        legend={`Current ${unitName.pluralC} on Subscription`}
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
        legend={
          formData.type == 'new'
            ? `Number of ${unitName.pluralC}`
            : formData.type === 'add'
            ? `${unitName.pluralC} to Add`
            : `Adjust Number of ${unitName.pluralC} By`
        }
        min={
          formData.type === 'sub'
            ? productData.minUsers - formData.existingUsers
            : productData.minUsers
        }
        max={productData.maxUsers - formData.existingUsers}
        step={productData.minUsers}
        name='userChange'
        value={formData.userChange}
        onChange={handleUserChangeChange}
        onBlur={handleUserChangeBlur}
        error={formData.userChangeError}
      />

      <ExtensionCheckboxes
        availableExtensions={productData.availableExtensions}
        selectedExtensions={formData.checkedExtensions}
        onChange={handleExtensionCheckboxChange}
      />

      <YearsSelect
        legend={`${
          formData.type == 'add' ? 'Remaining ' : ''
        }Subscription Length`}
        value={formData.years}
        onChange={handleInputChange}
        from={productData.minYears}
        to={productData.maxYears}
      />
    </form>
  )
}

export default SubscriptionConfigurator
