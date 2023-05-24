import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from './contexts/CartContext'
import { Tooltip } from 'react-tooltip'
import CheckoutButton from './CheckoutButton'
import InfoTooltip from './InfoTooltip'
import PricingType from '../utils/types/enums/PricingType'
import PurchaseType from '../utils/types/enums/PurchaseType'
import { formatPriceFromPennies } from '../utils/formatPrice'
import styles from '../styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cart, removeFromCart, getTotalPrice } = useContext(CartContext)
	const [licenceKeyLiveUpdate, setLicenceKeyLiveUpdate] = useState({})

	useEffect(() => {
		const newLicenceKeyLiveUpdate = { ...licenceKeyLiveUpdate }
		cart.forEach((item) => {
			if (item.licenceKey) {
				newLicenceKeyLiveUpdate[item.id] = item.licenceKey
			}
		})
		setLicenceKeyLiveUpdate(newLicenceKeyLiveUpdate)
	}, [cart])

	const handleRemoveItem = (id) => {
		removeFromCart(id)
	}

	const createLicenceKeyChangeHandler = (itemId) => {
		return (event) => {
			setLicenceKeyLiveUpdate((prevState) => ({
				...prevState,
				[itemId]: event.target.value,
			}))
		}
	}

	console.log(cart)

	return (
		<form className={styles.cartContainer}>
			<h2>Your Cart</h2>
			<fieldset className={styles.cartItems}>
				<legend>Items</legend>
				<ul>
					{cart.map((item) => {
						const isExistingLicence =
							(item.pricingType === PricingType.UNIT &&
								(item.purchaseType === PurchaseType.ADD ||
									item.purchaseType === PurchaseType.EXT ||
									item.purchaseType === PurchaseType.SUB)) ||
							(item.pricingType === PricingType.HARDSUB &&
								(item.purchaseType === PurchaseType.SPARE ||
									item.purchaseType === PurchaseType.SUB ||
									item.purchaseType === PurchaseType.WAREX))
						const handleLicenceKeyUpdate = createLicenceKeyChangeHandler(item.id)
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
								{isExistingLicence && (
									<label className={styles.licenceWrapper}>
										Existing licence key:{' '}
										<InfoTooltip>
											If you have access to it, please input the licence key for the existing subscription this purchase
											is to be applied to.
										</InfoTooltip>
										<input type='text' value={licenceKeyLiveUpdate[item.id]} onChange={handleLicenceKeyUpdate} />
									</label>
								)}
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
