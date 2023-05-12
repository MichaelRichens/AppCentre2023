import React from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import { Tooltip } from 'react-tooltip'
import { formatPriceFromPennies } from '../utils/formatPrice'
import styles from '../styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cartDetails, totalPrice, removeItem } = useShoppingCart()

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
								{` ${item.quantity > 1 ? item.quantity + ' x ' : ''}${item.name} - ${formatPriceFromPennies(
									item.price
								)}${
									item.quantity > 1
										? ' per unit = ' + formatPriceFromPennies(item.price * item.quantity) + ' total'
										: ''
								}`}
							</li>
						)
					})}
				</ul>
			</fieldset>
			<fieldset>
				<p>Total: {formatPriceFromPennies(totalPrice)}</p>
			</fieldset>
		</form>
	)
}

export default CartDisplay
