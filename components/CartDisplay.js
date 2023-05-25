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
	const { cart, getItem, removeFromCart, updateItem, getTotalPrice } = useContext(CartContext)
	const [licenceLiveUpdate, setLicenceLiveUpdate] = useState({})

	useEffect(() => {
		const newLicenceLiveUpdate = { ...licenceLiveUpdate }
		cart.forEach((item) => {
			if (item.licence) {
				newLicenceLiveUpdate[item.id] = item.licence
			}
		})
		setLicenceLiveUpdate(newLicenceLiveUpdate)
	}, [cart])

	const handleRemoveItem = (id) => {
		removeFromCart(id)
	}

	const createLicenceChangeHandler = (itemId) => {
		return (event) => {
			let newLicence = event.target.value
			if (newLicence.length > process.env.NEXT_PUBLIC_PRODUCT_LICENCE_MAX_LENGTH) {
				newLicence = newLicence.substring(0, process.env.NEXT_PUBLIC_PRODUCT_LICENCE_MAX_LENGTH)
			}
			setLicenceLiveUpdate((prevState) => ({
				...prevState,
				[itemId]: newLicence,
			}))
		}
	}

	const createLicenceOnBlurHandler = (itemId) => {
		return async () => {
			const newLicence = licenceLiveUpdate?.[itemId] || ''
			if (newLicence || getItem(itemId)?.licence?.length) {
				// A new licence string has been provided, or one already existed so we want to overwrite even if the new one is empty (to delete it)
				try {
					const response = await fetch('/api/update-configuration-licence', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: itemId, licence: newLicence }),
					})
					const data = await response.json()
					updateItem(itemId, { licence: newLicence })
				} catch (error) {
					console.error('Error updating licence.')
				}
			}
		}
	}

	return (
		<form className={styles.cartContainer}>
			<h2>Your Cart</h2>
			<fieldset className={styles.cartItems}>
				<legend>Items</legend>
				<ul>
					{cart.map((item) => {
						// Is this type of purchase some that modifies/renews an existing licence, or is it a new purchase?
						const isExistingLicence =
							(item.pricingType === PricingType.UNIT &&
								(item.purchaseType === PurchaseType.ADD ||
									item.purchaseType === PurchaseType.EXT ||
									item.purchaseType === PurchaseType.SUB)) ||
							(item.pricingType === PricingType.HARDSUB &&
								(item.purchaseType === PurchaseType.SPARE ||
									item.purchaseType === PurchaseType.SUB ||
									item.purchaseType === PurchaseType.WAREX))

						let displayName = item.name + (item?.licence ? ` (${item.licence})` : '')

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
								{`${displayName} - ${formatPriceFromPennies(item.price)}`}
								{isExistingLicence && (
									<label className={styles.licenceWrapper}>
										Existing licence key:{' '}
										<InfoTooltip>
											{`If you have access to it, please input the licence key for the existing subscription this ${
												item.purchaseType === PurchaseType.SUB ? 'renewal' : 'modification'
											} is to be applied to.`}
										</InfoTooltip>
										<input
											type='text'
											value={licenceLiveUpdate[item.id] || ''}
											onChange={createLicenceChangeHandler(item.id)}
											onBlur={createLicenceOnBlurHandler(item.id)}
										/>
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
