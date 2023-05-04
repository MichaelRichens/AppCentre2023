import React from 'react'
import { Table } from '@nextui-org/react'
import Word from '../utils/types/Word'
import { formatPrice } from '../utils/displayFunctions'

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
  console.log(productData)
  if (!productData.products || productData.products.length === 0) {
    error.log('No products found.')
    return null
  }

  const columns = [{ key: 'years', label: 'Subscription Length' }]
  const rows = []
  const shortestYears = productData.products[0].years
  for (let i = 0; i < productData.products.length; i++) {
    const product = productData.products[i]
    const key = `tier${product.units_from}`

    if (product.years === shortestYears) {
      const label = `${product.units_from} ${
        product.units_to > product.units_from ? '- ' + product.units_to : '+'
      } ${unitName.pluralC}`
      columns.push({ key: key, label: label })
    }
    console.log(product)
    if (rows.length == 0 || rows[rows.length - 1].key != product.years) {
      rows.push({
        key: product.years,
        years: `${product.years} Year${product.years != 1 ? 's' : ''}`,
      })
    }
    rows[rows.length - 1][key] = `${formatPrice(product.price)} per ${
      unitName.singularC
    }`
  }
  console.log(rows)
  return (
    <Table bordered headerLined striped aria-labelledby='pricingHeading'>
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row key={item.key}>
            {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default PriceTableWithUnits
