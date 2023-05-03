import React from 'react'
import SubscriptionPage from '../components/SubscriptionPage'
import Word from '../utils/types/word'
import fetchAndProcessProducts from '../server-utils/fetchAndProcessProducts'

export async function getStaticProps() {
  const productData = await fetchAndProcessProducts(
    process.env.NEXT_PUBLIC_PRODUCT_CODE_CONTROL
  )

  return {
    props: { productData },
    revalidate: 60 * 60 * process.env.PRODUCT_DATA_REVALIDATION_HOURS,
  }
}

const Control = (props) => {
  const { productData } = props
  return (
    <SubscriptionPage
      productName='Kerio Control'
      productIntro={<p>Kerio Control is etc.</p>}
      productFamily={process.env.NEXT_PUBLIC_PRODUCT_CODE_CONTROL}
      productData={productData}
      unitName={new Word('user', 'users')}></SubscriptionPage>
  )
}

export default Control