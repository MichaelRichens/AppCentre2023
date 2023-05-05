import React from 'react'
import Word from '../utils/types/Word'
import { formatPrice } from '../utils/displayFunctions'
import priceTableStyles from '../styles/PriceTable.shared.module.css'

/**
 * PricingWithUnits provides a price table element for the passed products.
 * It is for products which have per unit pricing with unit tiers.
 * @param {Object} props The component properties.
 * @param {string} props.productName - The display name of the product
 * @param {Object} props.productData - The product data object, importantly with the products field sorted first by subscription length, then by unit band.  Assume unit bands will be identical for different subscription lengths.
 * @param {Word} unitName - The name of the units that are used for price bands (eg Users)
 * @returns {JSX.Element} The pricing element.
 */
const PriceTableWithUnits = ({ productName, productData, unitName }) => {
  if (!productData.products || productData.products.length === 0) {
    error.log('No products found.')
    return null
  }

  const columns = ['Subscription Length']
  const rows = []
  const shortestYears = productData.products[0].years
  let currentRowYear = -1
  for (let i = 0; i < productData.products.length; i++) {
    const product = productData.products[i]

    if (product.years === shortestYears) {
      const label = `${product.units_from} ${
        product.units_to > product.units_from ? '- ' + product.units_to : '+'
      } ${unitName.pluralC}`
      columns.push(label)
    }
    if (rows.length == 0 || rows[rows.length - 1].length === columns.length) {
      rows.push([`${product.years} Year${product.years != 1 ? 's' : ''}`])
      currentRowYear = product.years
    }
    if (product.years !== currentRowYear) {
      // We're assuming we have the same user tiers in the database for each subscription length.
      //If this isn't true a lot of assumptions break down, so throw an error and go fix it.
      throw new Error(
        'Uneven number of skus found for different subscription lengths.  Cannot create price table.'
      )
    }
    rows[rows.length - 1].push(formatPrice(product.price))
  }
  return (
    <table
      className={priceTableStyles.priceTable}
      aria-labelledby='pricingHeading'
      aria-describedby='pricingCaption'>
      <caption id='pricingCaption'>
        Per {unitName.singularC} Pricing for {productName}
      </caption>
      <thead>
        <tr>
          {columns.map((label, index) => (
            <th key={index} scope='col'>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <th key={cellIndex} scope='row'>
                  {cell}
                </th>
              ) : (
                <td key={cellIndex}>{cell}</td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PriceTableWithUnits
