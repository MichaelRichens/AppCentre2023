import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { RotatingLines } from 'react-loader-spinner'
import { FlashMessageContext } from '../components/contexts/FlashMessageContext'
import Page from '../components/page/Page'
import CartDisplay from '../components/CartDisplay'
import { CartContext } from '../components/contexts/CartContext'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import MessageType from '../utils/types/enums/MessageType'
import { formatPriceFromPounds } from '../utils/formatPrice'

const CartPage = () => {
	const { isCartLoading, clearCart, addToCart, getTotalItems, getTotalPrice } = useContext(CartContext)
	const { setMessage } = useContext(FlashMessageContext)
	const [quoteError, setQuoteError] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const fetchConfigurationGroup = async () => {
			const { quote } = router.query

			if (quote) {
				if (typeof quote === 'string' && quote.startsWith('1')) {
					try {
						const response = await fetch('/api/get-configuration-group', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ id: quote }),
						})

						if (response.ok) {
							const data = await response.json()

							clearCart()

							Object.entries(data).forEach(([id, item]) => {
								const configuration = ProductConfiguration.fromRawProperties(item)

								addToCart({
									id: id,
									name: configuration.description,
									pricingType: configuration.pricingType,
									purchaseType: configuration.type,
									price: configuration.price,
									licence: configuration?.licence,
								})
								setMessage({
									text: `Quote Loaded. ${getTotalItems()} item${
										getTotalItems() !== 1 ? 's' : ''
									} - ${formatPriceFromPounds(getTotalPrice())}`,
									type: MessageType.INFO,
								})
							})
						} else if (response.status === 404) {
							setQuoteError('Very sorry, this quote could not be found.')
						} else if (response.status === 410) {
							setQuoteError('Very sorry, this quote is outdated and can not be loaded.')
						} else {
							setQuoteError('Very sorry, an unexpected error has occurred loading this quote.')
						}
					} catch (error) {
						setQuoteError('Very sorry, a fault has occurred and this quote could not be loaded.  Please try later.')
					}
				} else {
					setQuoteError('Very sorry, this quote link is not valid.')
				}
			}
		}

		if (router.isReady) {
			fetchConfigurationGroup()
		}
	}, [router.isReady])

	return (
		<Page title='Purchase Items'>
			{isCartLoading ? (
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
				<>
					{quoteError && (
						<p className='onPageError' aria-live='polite'>
							{quoteError}
						</p>
					)}
					<CartDisplay />
				</>
			)}
		</Page>
	)
}

export default CartPage
