import React, { useState, useEffect } from 'react'
import { useConfiguratorContext } from './contexts/ConfiguratorContext'
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
 * @returns {JSX.Element} The rendered component.
 */

const SubscriptionConfigurator = ({
  productName,
  productFamily,
  productData,
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

  useEffect(() => {
    saveConfiguratorData(productFamily, formData)
  }, [formData])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value, userChangeError: false })
  }

  const handleExistingUsersChange = (event) => {
    const { name, value } = event.target
    if (isNaN(value)) {
      return
    }
    setFormData({
      ...formData,
      [name]: parseInt(value),
      userChangeError: false,
    })
  }

  const handleExistingUsersBlur = (event) => {
    const { name, value } = event.target
    if (isNaN(value)) {
      setFormData({ ...formData, [name]: productData.minUsers })
      return
    } else {
      const existingUsers = Math.min(
        Math.max(parseInt(event.target.value), productData.minUsers),
        productData.maxUsers
      )
      setFormData({
        ...formData,
        [name]: existingUsers,
        userChangeError: false,
      })
    }
  }

  const handleUserChangeChange = (event) => {
    const { name, value } = event.target
    if (isNaN(value) && (formData.type != 'sub' || value != '-')) {
      return
    }
    let userChange
    if (value == '' || value == '-') {
      userChange = value
    } else {
      userChange = parseInt(value)
    }
    setFormData({ ...formData, [name]: userChange, userChangeError: false })
  }

  const handleUserChangeBlur = (event) => {
    const { name, value } = event.target
    if (isNaN(value)) {
      setFormData({
        ...formData,
        [name]: formData.type == 'add' ? productData.minUserChange : 0,
      })
    } else {
      const { userChange, userChangeError } = calculateUserChange(
        parseInt(event.target.value)
      )
      setFormData({
        ...formData,
        [name]: userChange,
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
    const userChangeBeforeClamp = value
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

  const canShowAddOption =
    productData.maxUsers - productData.minUsers > formData.existingUsers

  const userChangeLabel =
    formData.type == 'new'
      ? 'Number of Users'
      : formData.type === 'add'
      ? 'Users to Add'
      : 'Adjust Number of Users By:'

  const yearsInput =
    productData.minYears !== productData.maxYears ? (
      <label>
        {formData.type == 'add' && 'Remaining '}Subscription Length
        {formData.type == 'add' ? ' <=' : ':'}
        <select
          name='years'
          value={formData.years}
          onChange={handleInputChange}>
          {[...Array(productData.maxYears - productData.minYears + 1)].map(
            (_, i) => {
              const year = productData.minYears + i
              return (
                <option key={year} value={year}>
                  {year} Year{year != 1 && 's'}
                </option>
              )
            }
          )}
        </select>
      </label>
    ) : (
      `Subscription Length ${productData.minYears} ${
        productData.minYears > 1 ? 'Years' : 'Year'
      }`
    )

  const { price } = generateSkusAndCalculatePrice(
    productData.products,
    savedData
  )

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price)

  return (
    <form className={configuratorStyles.configurator}>
      <label>
        Type:
        <select name='type' value={formData.type} onChange={handleInputChange}>
          <option value='sub'>Existing Subscription Renewal</option>
          <option value='new'>New Subscription</option>
          {canShowAddOption && (
            <option value='add'>Add Users To Subscription</option>
          )}
        </select>
      </label>
      <span>
        {(() => {
          let str = ''
          switch (formData.type) {
            case 'sub':
              str += `Renewing with ${
                formData.existingUsers + formData.userChange
              } users`
              str += ` for ${formData.years} Year${
                formData.years != 1 ? 's' : ''
              }`
              break
            case 'new':
              str += `With ${formData.userChange} users`
              str += ` for ${formData.years} Year${
                formData.years != 1 ? 's' : ''
              }`
              break
            case 'add':
              str += `Bringing the total to ${
                formData.existingUsers + formData.userChange
              } users`
              break
          }
          return str + ` - ${formattedPrice} + vat`
        })()}
      </span>
      <br />
      {formData.type !== 'new' && (
        <>
          <label>
            Current Users on Subscription:
            <input
              type='text'
              name='existingUsers'
              value={formData.existingUsers}
              min={productData.minUsers}
              max={productData.maxUsers}
              onChange={handleExistingUsersChange}
              onBlur={handleExistingUsersBlur}
            />
          </label>
          <br />
        </>
      )}
      <label>
        {userChangeLabel}
        <input
          type='text'
          name='userChange'
          value={formData.userChange}
          min={
            formData.type === 'sub'
              ? productData.minUsers - formData.existingUsers
              : productData.minUsers
          }
          max={productData.maxUsers - formData.existingUsers}
          onChange={handleUserChangeChange}
          onBlur={handleUserChangeBlur}
        />
      </label>
      {formData.userChangeError !== false && (
        <span className={configuratorStyles.formError}>
          {formData.userChangeError}
        </span>
      )}
      <br />
      {yearsInput}
    </form>
  )
}

export default SubscriptionConfigurator
