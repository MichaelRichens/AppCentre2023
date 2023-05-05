import React from 'react'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/global.css'

function App({ Component, pageProps }) {
	return (
		<ConfiguratorProvider>
			<Component {...pageProps} />
		</ConfiguratorProvider>
	)
}

export default App
