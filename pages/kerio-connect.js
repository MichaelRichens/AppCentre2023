import React from 'react'

import ProductPage from '../components/ProductPage'

import fetchAndProcessProducts from '../utils/fetchAndProcessProducts'

export async function getStaticProps() {
  const processedProducts = await fetchAndProcessProducts()

  return {
    props: processedProducts,
    revalidate: 60 * 60 * 24, // 24 hours
  }
}

const Connect = (processedProducts) => {
  return (
    <ProductPage
      productName='Kerio Connect'
      productIntro={<p>Kerio Connect is etc.</p>}
      productFamily='CONNECT'
      processedProducts={processedProducts}></ProductPage>
  )
}

export default Connect
