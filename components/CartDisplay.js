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
	const { cart, getItem, removeFromCart, updateItem, getTotalItems, getTotalPrice } = useContext(CartContext)

	// backing fields for debouncing licence key input from the user
	const [licenceLiveUpdate, setLicenceLiveUpdate] = useState({})

	// Don't want to store a new config group if someone clicks the button multiple times, so when the config group is created, we'll save its id and an array
	// of the cart item ids, and if the button is clicked again we'll just use the same group id.
	// A useEffect watching `cart` handles wiping the saved data if the cart is changed.
	const [savedConfigurationGroup, setSavedConfigurationGroup] = useState(false)

	// Changes to the items in the cart
	useEffect(() => {
		// update the debouncing fields of the licence key inputs to the current state
		const newLicenceLiveUpdate = { ...licenceLiveUpdate }
		cart.forEach((item) => {
			if (item.licence) {
				newLicenceLiveUpdate[item.id] = item.licence
			}
		})
		setLicenceLiveUpdate(newLicenceLiveUpdate)

		// Check that, if there is a saved configuration group, if it is still valid.
		// Which it is if all the cart items have the same ids in the same order - changes to licence keys have been written to the db under the same id
		if (savedConfigurationGroup) {
			if (savedConfigurationGroup.itemIds.length !== cart.length) {
				setSavedConfigurationGroup(false)
			} else {
				for (let i = 0; i < cart.length; i++) {
					if (cart[i].id != savedConfigurationGroup.itemIds[i]) {
						setSavedConfigurationGroup(false)
						break
					}
				}
			}
		}
	}, [cart])

	useEffect(() => {
		const handleFirstTab = (e) => {
			if (e.keyCode === 9) {
				// the "I am a keyboard user" key
				document.body.classList.add('userIsTabbing')
				window.removeEventListener('keydown', handleFirstTab)
			}
		}

		window.addEventListener('keydown', handleFirstTab)
	}, [])

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

	const asyncSaveConfigOnClickHandler = async () => {
		// Can't rely on setSavedConfigurationGroup to immediately refresh value of savedConfigurationGroup, so need to use a local variable
		let groupId = savedConfigurationGroup.id
		if (!groupId) {
			const configurations = cart.map((item) => item.id)
			if (configurations.length) {
				try {
					const response = await fetch('/api/save-configuration-group', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ configurations }), // sending the configurations
					})

					if (response.ok) {
						// Handle 2XX status codes
						const data = await response.json()

						console.log(data)

						setSavedConfigurationGroup({ id: data.id, itemIds: cart.map((item) => item.id) })
						groupId = data.id
					} else if (response.status === 410) {
						// Handle 410 status code
						// Do something specific for this status code
					} else {
						// Handle other status codes
						throw new Error(`Server responded with a status of ${response.status}`)
					}
				} catch (error) {
					console.error('Failed to save configuration group:', error.message)
				}
			}
		}
		// groupId should now hold either a previously saved configuration group id, or the new one that has just been created and is currently being setSavedConfigurationGroup (async, probably not completed yet)
		// if there has been an error of some sort groupId will be false
		if (groupId) {
			const link = process.env.NEXT_PUBLIC_DEPLOY_URL + '/cart?quote=' + groupId
			try {
				await navigator.clipboard.writeText(link)
			} catch (clipboardError) {
				console.error('Failed to copy text to clipboard:', clipboardError)
				// Provide an alternative way to copy the text
			}
		}
	}

	return (
		<form className={styles.cartContainer} onSubmit={(e) => e.preventDefault()}>
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
									type='button'
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
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault()
													e.target.blur()
												}
											}}
										/>
									</label>
								)}
							</li>
						)
					})}
				</ul>
			</fieldset>
			<small className='keyboardNote' aria-live='polite'>
				Note: Pressing Enter will not submit the form.
			</small>
			<fieldset>
				<legend>Total</legend>
				<p>Total: {formatPriceFromPennies(getTotalPrice())}</p>
				<CheckoutButton />
				<div className={styles.configSave}>
					<button type='button' disabled={!getTotalItems()} onClick={asyncSaveConfigOnClickHandler}>
						Save
					</button>
				</div>
			</fieldset>
		</form>
	)
}

export default CartDisplay
