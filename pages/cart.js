import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { RotatingLines } from 'react-loader-spinner'
import Page from '../components/Page'
import CartDisplay from '../components/CartDisplay'
import { CartContext } from '../components/contexts/CartContext'
import ProductConfiguration from '../utils/types/ProductConfiguration'

const CartPage = () => {
	const { isCartLoading, clearCart, addToCart } = useContext(CartContext)
	const router = useRouter()

	useEffect(() => {
		const fetchConfigurationGroup = async () => {
			const { quote } = router.query

			if (quote && typeof quote === 'string' && quote.startsWith('1')) {
				try {
					const response = await fetch('/api/get-configuration-group', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: quote }),
					})

					if (response.ok) {
						// Handle 2XX status codes
						console.log('2XX status code')
						const data = await response.json()
						// Log the results of the API to the console

						clearCart()
						console.log(data)
						Object.entries(data).forEach(([id, item]) => {
							console.log(item)
							const configuration = ProductConfiguration.fromRawProperties(item)
							configuration.summary
							addToCart({
								id: id,
								name: configuration.description,
								pricingType: configuration.pricingType,
								purchaseType: configuration.type,
								price: configuration.price,
								licence: configuration?.licence,
							})
						})
					} else if (response.status === 404) {
						// Handle 404 status code
						console.log('404 status code')
					} else if (response.status === 410) {
						// Handle 410 status code
						console.log('410 status code')
					} else {
						// Handle other status codes
						console.log('Other status code')
					}
				} catch (error) {
					console.error('Error:', error)
				}
			}
		}

		if (router.isReady) {
			fetchConfigurationGroup()
		}
	}, [router.isReady])

	return (
		<Page title='Purchase Items'>
			{isCartLoading() ? (
				<div style={{ textAlign: 'center' }}>
					<RotatingLines
						width='25%'
						animationDuration='1.5'
						strokeColor='#666'
						color='#243059'
						ariaLabel='Adding to Cart'
					/>
				</div>
			) : (
				<CartDisplay />
			)}
		</Page>
	)
}

export default CartPage
