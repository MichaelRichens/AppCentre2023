import React, { useState, useEffect } from 'react'

/**
 * ProductConfigurator is a component that allows users to configure a their subscription
 * It generates a subscription for the software product with the passed productFamily
 * It is customised with the passed productName.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.productName - The name of the product to be configured.
 * @param {string} props.productFamily - The identifier for the product family.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @returns {JSX.Element} The rendered component.
 */

const ProductConfigurator = ({ productName, productFamily, productData }) => {
  const [formData, setFormData] = useState({
    type: 'sub',
    users: productData.minUsers,
    years: productData.minYears,
  })

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      users: productData.minUsers,
      years: productData.minYears,
    }))
  }, [productData])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUsersChange = (event) => {
    const users = Math.min(
      Math.max(event.target.value, productData.minUsers),
      productData.maxUsers
    )
    setFormData({ ...formData, users })
  }

  const usersLabel =
    formData.type === 'add'
      ? 'Set Number of Users Currently on Subscription:'
      : 'Number of Users:'

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
            <option value='add'>Add Users To Subscription</option>
          </select>
        </label>
        <br />
        <label>
          {usersLabel}
          <input
            type='number'
            name='users'
            value={formData.users}
            min={productData.minUsers}
            max={productData.maxUsers}
            onChange={handleUsersChange}
          />
        </label>
        {formData.type === 'sub' && (
          <span> (Adjust number to add or remove users)</span>
        )}
        <br />
        {yearsLabel}
      </form>
    </section>
  )
}

export default ProductConfigurator
