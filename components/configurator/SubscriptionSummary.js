import React from 'react'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

const SubscriptionSummary = ({ productName, price, formData, unitName }) => {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price)
  let str = ''
  switch (formData.type) {
    case 'sub':
      str += `Renewing ${productName} with ${
        formData.existingUsers + formData.userChange
      } ${unitName.pluralLC}`
      str += ` for ${formData.years} year${formData.years != 1 ? 's' : ''}`
      break
    case 'new':
      str += `Purchasing ${productName} with ${formData.userChange} ${unitName.pluralLC}`
      str += ` for ${formData.years} year${formData.years != 1 ? 's' : ''}`
      break
    case 'add':
      str += `Purchasing ${formData.userChange} additional ${productName} ${
        unitName.pluralLC
      }, bringing the total to ${
        formData.existingUsers + formData.userChange
      } ${unitName.pluralLC}`
      break
  }
  return (
    <fieldset className={configuratorStyles.summary}>
      <p>{str}</p>
      <p>{`${formattedPrice} + vat`}</p>
    </fieldset>
  )
}

export default SubscriptionSummary
