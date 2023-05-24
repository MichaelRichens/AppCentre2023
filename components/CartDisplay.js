import React, { useContext } from 'react'
import { CartContext } from './contexts/CartContext'
import { Tooltip } from 'react-tooltip'
import CheckoutButton from './CheckoutButton'
import { formatPriceFromPennies } from '../utils/formatPrice'
import styles from '../styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cart, removeFromCart, getTotalPrice } = useContext(CartContext)

	const handleRemoveItem = (id) => {
		removeFromCart(id)
	}
	return (
		<form className={styles.cartContainer}>
			<h2>Your Cart</h2>
			<fieldset className={styles.cartItems}>
				<legend>Items</legend>
				<ul>
					{cart.map((item) => {
						return (
							<li key={item.id}>
								<button
									onClick={() => handleRemoveItem(item.id)}
									aria-label='Remove Item'
									data-tooltip-id={`remove-item-${item.id}`}
									data-tooltip-content='Remove Item'>
									X
								</button>
								<Tooltip id={`remove-item-${item.id}`} />
								{`${item.name} - ${formatPriceFromPennies(item.price)}`}
							</li>
						)
					})}
				</ul>
			</fieldset>
			<fieldset>
				<legend>Total</legend>
				<p>Total: {formatPriceFromPennies(getTotalPrice())}</p>
				<CheckoutButton />
			</fieldset>
		</form>
	)
}

export default CartDisplay
