import React from 'react'
import { AuthProvider } from '../components/contexts/AuthContext'
import { CartProvider } from '../components/contexts/CartContext'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/font-face.css'
import '../styles/global.css'
import 'react-tooltip/dist/react-tooltip.css'

function App({ Component, pageProps }) {
	return (
		<AuthProvider>
			<CartProvider>
				<ConfiguratorProvider>
					<Component {...pageProps} />
				</ConfiguratorProvider>
			</CartProvider>
		</AuthProvider>
	)
}

export default App
