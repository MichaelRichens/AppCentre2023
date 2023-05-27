import React from 'react'
import { AuthProvider } from '../components/contexts/AuthContext'
import { FlashMessageProvider } from '../components/contexts/FlashMessageContext'
import { CartProvider } from '../components/contexts/CartContext'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/font-face.css'
import '../styles/global.css'
import 'react-tooltip/dist/react-tooltip.css'

function App({ Component, pageProps }) {
	return (
		<AuthProvider>
			<FlashMessageProvider>
				<CartProvider>
					<ConfiguratorProvider>
						<Component {...pageProps} />
					</ConfiguratorProvider>
				</CartProvider>
			</FlashMessageProvider>
		</AuthProvider>
	)
}

export default App
