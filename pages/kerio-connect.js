import React from 'react'

import ProductPage from '../components/ProductPage'

import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
  const matchingProducts = await fetchAndProcessProducts(
    process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT
  )

  return {
    props: { products: matchingProducts },
    revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
  }
}

const Connect = (products) => {
  return (
    <ProductPage
      productName='Kerio Connect'
      productIntro={<p>Kerio Connect is etc.</p>}
      productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONNECT}
      products={products}></ProductPage>
  )
}

export default Connect
