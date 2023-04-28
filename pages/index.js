import React, { useState } from 'react'
import Page from '../components/Page'
import { fetchPrice } from '../utils/prices'

const Home = () => {
  const [price, setPrice] = useState(null)

  const handleClick = async () => {
    const productCode = 'example-product-code'
    const numberOfUsers = 5
    const numberOfYears = 1
    const extensionCodes = ['ext1', 'ext2']

    const fetchedPrice = await fetchPrice(
      productCode,
      numberOfUsers,
      numberOfYears,
      extensionCodes
    )
    setPrice(fetchedPrice)
  }

  return (
    <Page title='Home'>
      <p>Welcome to our home page!</p>
      <button onClick={handleClick}>Get Price</button>
      {price && (
        <p>
          Price: {price.gbp} GBP, Hash: {price.hash}
        </p>
      )}
      <p>{process.env.NEXT_PUBLIC_SITE_URL}</p>
      <p>{process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL}</p>
    </Page>
  )
}

export default Home
