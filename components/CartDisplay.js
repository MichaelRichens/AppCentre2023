import React from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { Tooltip } from 'react-tooltip'
import styles from '../styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cartDetails, formattedTotalPrice, removeItem } = useShoppingCart()

	const handleRemoveItem = (id) => {
		removeItem(id)
	}

	return (
		<form className={styles.cartContainer}>
			<h2>Your Cart</h2>
			<fieldset className={styles.cartItems}>
				<legend>Items</legend>
				<ul>
					{Object.keys(cartDetails).map((itemID) => {
						const item = cartDetails[itemID]
						return (
							<li key={itemID}>
								<button
									onClick={() => handleRemoveItem(itemID)}
									aria-label='Delete Item'
									data-tooltip-id={`remove-item-${itemID}`}
									data-tooltip-content='Delete Item'>
									X
								</button>
								<Tooltip id={`remove-item-${itemID}`} />
								{` ${item.quantity > 1 ? item.quantity + ' x ' : ''}${item.name}`}
							</li>
						)
					})}
				</ul>
			</fieldset>
			<h3>Total: {formattedTotalPrice}</h3>
		</form>
	)
}

export default CartDisplay
