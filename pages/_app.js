import React from 'react'

import { NextUIProvider } from '@nextui-org/react'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/global.css'

function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <ConfiguratorProvider>
        <Component {...pageProps} />
      </ConfiguratorProvider>
    </NextUIProvider>
  )
}

export default App
