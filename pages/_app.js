import React from 'react'
import { CartProvider } from 'use-shopping-cart'
import { ConfiguratorProvider } from '../components/contexts/ConfiguratorContext'

import '../styles/font-face.css'
import '../styles/global.css'
import 'react-tooltip/dist/react-tooltip.css'

function App({ Component, pageProps }) {
	return (
		<CartProvider
			mode='client-only'
			stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
			currency={process.env.NEXT_PUBLIC_CURRENCY_UC}
			successUrl={`${process.env.NEXT_PUBLIC_DEPLOY_URL}/success`}
			cancelUrl={`${process.env.NEXT_PUBLIC_DEPLOY_URL}/cancelled`}
			allowedCountries={['GB']}
			billingAddressCollection={true}
			persistKey='cart'>
			<ConfiguratorProvider>
				<Component {...pageProps} />
			</ConfiguratorProvider>
		</CartProvider>
	)
}

export default App
