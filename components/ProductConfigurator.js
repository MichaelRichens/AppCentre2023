import React from 'react'

import useProducts from './hooks/useProducts'
import Loading from './Loading'

/**
 * ProductConfigurator is a component that allows users to configure a their subscription
 * It generates a subscription for the software product with the passed productFamily
 * It is customised with the passed productName.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.productName - The name of the product to be configured.
 * @param {string} props.productFamily - The identifier for the product family.
 * @returns {JSX.Element} The rendered component.
 */

const ProductConfigurator = ({ productName, productFamily }) => {
  const productsData = useProducts()

  if (!productsData || !productsData[productFamily]) {
    return <Loading />
  }
  const products = productsData[productFamily]

  return <section>{/* ... component JSX ... */}</section>
}

export default ProductConfigurator
