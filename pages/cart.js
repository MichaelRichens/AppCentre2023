import React, { useContext } from 'react'
import Page from '../components/Page'
import CartDisplay from '../components/CartDisplay'
import { CartContext } from '../components/contexts/CartContext'
import { RotatingLines } from 'react-loader-spinner'

const CartPage = () => {
	const { isCartLoading } = useContext(CartContext)

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
