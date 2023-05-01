import React, { useState, useEffect } from 'react'

import { useConfiguratorContext } from '../components/contexts/ConfiguratorContext'

import generateSkusAndCalculatePrice from '../utils/generateSkusAndCalculatePrice'

/**
 * ProductConfigurator is a component that allows users to configure a their subscription
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

const ProductConfigurator = ({ productName, productFamily, productData }) => {
  const { configuratorData, saveConfiguratorData } = useConfiguratorContext()
  const savedData = configuratorData[productFamily] || {
    type: 'sub',
    userChange: 0,
    years: productData.minYears,
    existingUsers: productData.minUsers,
  }

  const [formData, setFormData] = useState(savedData)

  useEffect(() => {
    saveConfiguratorData(productFamily, formData)
  }, [formData])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUserChangeChange = (event) => {
    const userChange = calculateUserChange(event.target.value)
    setFormData({ ...formData, userChange })
  }

  const handleExistingUsersChange = (event) => {
    const existingUsers = Math.min(
      Math.max(event.target.value, productData.minUsers),
      productData.maxUsers
    )
    setFormData({ ...formData, existingUsers })
  }

  const calculateUserChange = (value) => {
    // Parse the user input as an integer.
    let userChange = parseInt(value)

    // Calculate the minimum and maximum user change values based on the type of subscription.
    const minUserChange =
      formData.type === 'new' || formData.type === 'add'
        ? productData.minUsers
        : productData.minUsers - formData.existingUsers
    const maxUserChange = productData.maxUsers - formData.existingUsers

    // Clamp the userChange value to be between minUserChange and maxUserChange.
    userChange = Math.min(Math.max(userChange, minUserChange), maxUserChange)

    // Calculate the remainder of userChange when divided by productData.minUsers.
    const remainder = userChange % productData.minUsers
    // If the remainder is not 0, it means the userChange value is not divisible by productData.minUsers.
    if (remainder !== 0) {
      // Determine the direction of change (1 for positive change, -1 for negative change).
      const direction = value > formData.userChange ? 1 : -1
      // Add the difference between productData.minUsers and the remainder (or negative remainder when direction is negative) to the userChange value,
      // multiplied by the direction of change.
      userChange += direction * (productData.minUsers - remainder * direction)
      // Clamp the userChange value again to ensure it remains between minUserChange and maxUserChange.
      userChange = Math.min(Math.max(userChange, minUserChange), maxUserChange)
    }
    // Return the final userChange value.
    return userChange
  }

  const canShowAddOption =
    productData.maxUsers - productData.minUsers > formData.existingUsers

  const userChangeLabel =
    formData.type == 'new'
      ? 'Number of Users'
      : formData.type === 'add'
      ? 'Users to Add'
      : 'Adjust Number of Users By:'

  const yearsLabel =
    productData.minYears !== productData.maxYears ? (
      <label>
        Subscription Length in Years:
        <select
          name='years'
          value={formData.years}
          onChange={handleInputChange}>
          {[...Array(productData.maxYears - productData.minYears + 1)].map(
            (_, i) => {
              const year = productData.minYears + i
              return (
                <option key={year} value={year}>
                  {year}
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
    <section>
      <form>
        <label>
          Type:
          <select
            name='type'
            value={formData.type}
            onChange={handleInputChange}>
            <option value='sub'>Existing Subscription Renewal</option>
            <option value='new'>New Subscription</option>
            {canShowAddOption && (
              <option value='add'>Add Users To Subscription</option>
            )}
          </select>
        </label>
        <br />
        {formData.type !== 'new' && (
          <>
            <label>
              Current Users on Subscription:
              <input
                type='number'
                name='existingUsers'
                value={formData.existingUsers}
                min={productData.minUsers}
                max={productData.maxUsers}
                onChange={handleExistingUsersChange}
              />
            </label>
            <br />
          </>
        )}
        <label>
          {userChangeLabel}
          <input
            type='number'
            name='userChange'
            value={formData.userChange}
            min={
              formData.type === 'sub'
                ? productData.minUsers - formData.existingUsers
                : productData.minUsers
            }
            max={productData.maxUsers - formData.existingUsers}
            onChange={handleUserChangeChange}
          />
        </label>
        {formData.type === 'sub' && (
          <span>
            {' '}
            Users to Renew: {formData.existingUsers + formData.userChange}
          </span>
        )}
        <br />
        {yearsLabel}
      </form>
      <div>Price: {formattedPrice}</div>
    </section>
  )
}

export default ProductConfigurator
