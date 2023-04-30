import React from 'react'

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
  return <section>{JSON.stringify(productData)}</section>
}

export default ProductConfigurator
