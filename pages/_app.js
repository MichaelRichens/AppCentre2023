import React from 'react'

import { ProductsProvider } from '../components/contexts/ProductsContext'

import '../styles/global.css'

function App({ Component, pageProps }) {
  return (
    <ProductsProvider>
      <Component {...pageProps} />
    </ProductsProvider>
  )
}

export default App
