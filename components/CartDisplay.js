import React from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import styles from '../styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cartDetails, clearCart, formattedTotalPrice, removeItem } = useShoppingCart()

	const handleClearCart = () => {
		clearCart()
	}

	const handleRemoveItem = (id) => {
		removeItem(id)
	}

	return (
		<div className={styles.cartContainer}>
			<h2>Your Cart</h2>
			<ul>
				{Object.keys(cartDetails).map((itemID) => {
					const item = cartDetails[itemID]
					return (
						<li key={itemID}>
							<button onClick={() => handleRemoveItem(itemID)} aria-label='Remove Item'>
								X
							</button>
							{` ${item.quantity} x ${item.name}`}
						</li>
					)
				})}
			</ul>
			<h3>Total: {formattedTotalPrice}</h3>
			<button onClick={handleClearCart}>Clear Cart</button>
		</div>
	)
}

export default CartDisplay
