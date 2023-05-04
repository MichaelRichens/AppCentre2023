import React from 'react'

/**
 *
 *
 * @returns {JSX.Element}
 */
function generateSummary(
  productName,
  type,
  price,
  existingUsers,
  userChange,
  years,
  unitName
) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price)
  let str = ''
  switch (type) {
    case 'sub':
      str += `Renewing ${productName} with ${existingUsers + userChange} ${
        unitName.pluralLC
      }`
      str += ` for ${years} year${years != 1 ? 's' : ''}.`
      break
    case 'new':
      str += `Purchasing ${productName} with ${userChange} ${unitName.pluralLC}`
      str += ` for ${years} year${years != 1 ? 's' : ''}.`
      break
    case 'add':
      str += `Purchasing ${userChange} additional ${productName} ${unitName.pluralLC}`
      str +=
        process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_USERS ===
        'true'
          ? `, bringing the total to ${existingUsers + userChange} ${
              unitName.pluralLC
            }.`
          : '.'
      break
  }
  return null
}

export default generateSummary
