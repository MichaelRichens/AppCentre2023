import React from 'react'
import { CartProvider } from '../components/contexts/CartContext'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/font-face.css'
import '../styles/global.css'
import 'react-tooltip/dist/react-tooltip.css'

function App({ Component, pageProps }) {
	return (
		<CartProvider
			mode='payment'
			cartMode='client-only'
			stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
			currency={process.env.NEXT_PUBLIC_CURRENCY_UC}
			successUrl={`${process.env.NEXT_PUBLIC_DEPLOY_URL}/success`}
			cancelUrl={`${process.env.NEXT_PUBLIC_DEPLOY_URL}/cancelled`}
			allowedCountries={['GB']}
			billingAddressCollection={true}
			shouldPersist={true}
			persistKey={process.env.NEXT_PUBLIC_CART_PERSIST_KEY_FRAGMENT}>
			<ConfiguratorProvider>
				<Component {...pageProps} />
			</ConfiguratorProvider>
		</CartProvider>
	)
}

export default App
