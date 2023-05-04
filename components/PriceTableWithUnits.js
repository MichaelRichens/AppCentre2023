import React from 'react'
import Word from '../utils/types/Word'

/**
 * PricingWithUnits provides a price table element for the passed products.
 * It is for products which have per unit pricing with unit tiers.
 * @param {string} productName - The display name of the product
 * @param {Object[]} sortedProductData - Products sorted first by subscription length, then by unit band.  Assume unit bands will be identical for different subscription lengths.
 * @param {Word} unitName - The name of the units that are used for price bands (eg Users)
 * @returns {JSX.Element} The pricing element.
 */
const PriceTableWithUnits = ({ productName, sortedProductData, unitName }) => {
  console.log(sortedProductData)

  return (
    <>
      <div></div>
    </>
  )
}

export default PriceTableWithUnits
