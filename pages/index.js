import React from 'react'
import Page from '../components/Page'
import ProductsList from '../components/ProductsList'

const Home = () => {
  return (
    <Page title='Home'>
      <p>Welcome to our home page!</p>
      <div>
        <ProductsList />
      </div>
    </Page>
  )
}

export default Home
