import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from './contexts/ConfiguratorContext'
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
    userChange: 0,
    years: productData.minYears,
    existingUsers: productData.minUsers,
  }

  const [formData, setFormData] = useState(savedData)

  if (formData.userChangeError === undefined) {
    formData.userChangeError = false
  }
  if (formData.existingUsersError === undefined) {
    formData.existingUsersError = false
  }

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
  const { price } = generateSkusAndCalculatePrice(
    productData.products,
    savedData
  )

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price)
  const canShowAddOption =
    productData.maxUsers - productData.minUsers > formData.existingUsers

  const currentSummary = (() => {
    let str = ''
    switch (formData.type) {
      case 'sub':
        str += `Renewing with ${formData.existingUsers + formData.userChange} ${
          unitName.pluralLC
        }`
        str += ` for ${formData.years} year${formData.years != 1 ? 's' : ''}`
        break
      case 'new':
        str += `Purchasing ${productName} with ${formData.userChange} ${unitName.pluralLC}`
        str += ` for ${formData.years} year${formData.years != 1 ? 's' : ''}`
        break
      case 'add':
        str += `Purchasing ${formData.userChange} additional ${
          unitName.pluralLC
        }, bringing the total to ${
          formData.existingUsers + formData.userChange
        } ${unitName.pluralLC}`
        break
    }
    return <p>{str + ` - ${formattedPrice} + vat`}</p>
  })()

  const typeChangeSelect = (
    <fieldset>
      <legend>Type of Purchase</legend>
      <select
        name='type'
        value={formData.type}
        onChange={handleTypeChange}
        aria-label='Type of Purchase'>
        <option value='sub'>Existing Subscription Renewal</option>
        <option value='new'>New Subscription</option>
        {canShowAddOption && (
          <option value='add'>{`Add ${unitName.pluralC} To Subscription`}</option>
        )}
      </select>
    </fieldset>
  )

  const existingUsersInputLegend = `Current ${unitName.pluralC} on Subscription`

  const existingUsersInput = (
    <fieldset>
      <legend>{existingUsersInputLegend}</legend>
      <input
        type='number'
        step={productData.minUsers}
        name='existingUsers'
        className={configuratorStyles.userQty}
        value={formData.existingUsers}
        min={productData.minUsers}
        max={productData.maxUsers}
        onChange={handleExistingUsersChange}
        onBlur={handleExistingUsersBlur}
        aria-label={existingUsersInputLegend}
      />
      {formData.existingUsersError !== false && (
        <span className={configuratorStyles.formError}>
          {formData.existingUsersError}
        </span>
      )}
    </fieldset>
  )

  const userChangeInputLegend =
    formData.type == 'new'
      ? `Number of ${unitName.pluralC}`
      : formData.type === 'add'
      ? `${unitName.pluralC} to Add`
      : `Adjust Number of ${unitName.pluralC} By`

  const userChangeInput = (
    <fieldset>
      <legend>{userChangeInputLegend}</legend>
      <input
        type='number'
        step={productData.minUsers}
        name='userChange'
        className={configuratorStyles.userQty}
        value={formData.userChange}
        min={
          formData.type === 'sub'
            ? productData.minUsers - formData.existingUsers
            : productData.minUsers
        }
        max={productData.maxUsers - formData.existingUsers}
        onChange={handleUserChangeChange}
        onBlur={handleUserChangeBlur}
        aria-label={userChangeInputLegend}
      />
      {formData.userChangeError !== false && (
        <span className={configuratorStyles.formError}>
          {formData.userChangeError}
        </span>
      )}
    </fieldset>
  )

  const extensionCheckboxes = (
    <fieldset className={configuratorStyles.checkbox}>
      <legend>Select Extensions</legend>
      {productData.availableExtensions.map((extension) => (
        <label key={extension.key} className={configuratorStyles.checkbox}>
          <input
            type='checkbox'
            name='extensions'
            value={extension.key}
            id={`extension-${extension.key}`}
          />
          {extension.name}
        </label>
      ))}
    </fieldset>
  )

  const yearsSelectLegend = `${
    formData.type == 'add' ? 'Remaining ' : ''
  }Subscription Length`

  const yearsSelect =
    productData.minYears !== productData.maxYears ? (
      <fieldset>
        <legend>{yearsSelectLegend}</legend>
        <select
          name='years'
          value={formData.years}
          onChange={handleInputChange}
          aria-label={yearsSelectLegend}>
          {[...Array(productData.maxYears - productData.minYears + 1)].map(
            (_, i) => {
              const year = productData.minYears + i
              return (
                <option key={year} value={year}>
                  {`${year} Year${year != 1 ? 's' : ''}`}
                </option>
              )
            }
          )}
        </select>
      </fieldset>
    ) : (
      `Subscription Length ${productData.minYears} ${
        productData.minYears > 1 ? 'Years' : 'Year'
      }`
    )

  return (
    <form className={configuratorStyles.configurator}>
      {currentSummary}
      {typeChangeSelect}
      {formData.type !== 'new' && <>{existingUsersInput}</>}
      {userChangeInput}
      {haveAnyExtensions && <>{extensionCheckboxes}</>}
      {yearsSelect}
    </form>
  )
}

export default SubscriptionConfigurator
