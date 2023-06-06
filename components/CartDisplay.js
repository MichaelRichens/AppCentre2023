import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from './contexts/CartContext'
import { FlashMessageContext, MessageType } from './contexts/FlashMessageContext'
import { Tooltip } from 'react-tooltip'
import useUniqueId from './hooks/useUniqueId'
import CheckoutButton from './CheckoutButton'
import BusyButton from './BusyButton'
import InfoTooltip from './InfoTooltip'
import PricingType from '../utils/types/enums/PricingType'
import PurchaseType from '../utils/types/enums/PurchaseType'
import { getBaseUrlFromLocation } from '../utils/baseUrl'
import { formatPriceFromPounds } from '../utils/formatPrice'
import styles from '/styles/CartDisplay.module.css'

const CartDisplay = () => {
	const { cart, isCartLoading, getItem, removeFromCart, updateItem, getTotalItems, getTotalPrice } =
		useContext(CartContext)

	// Can be multiple copies of this component - use this as a prefix so elements can have separate ids from each other
	const cartId = useUniqueId('cart')

	// backing field arrays for debouncing licence key input from the user
	const [licenceLiveUpdate, setLicenceLiveUpdate] = useState({})

	// For holding the base url this page is running on - requires window.location to be available, so need state populated inside a useEffect
	const [baseUrl, setBaseUrl] = useState(null)

	// Don't want to store a new config group if someone clicks the button multiple times, so when the config group is created, we'll save its id and an array
	// of the cart item ids, and if the button is clicked again we'll just use the same group id.  Just local state, so doesn't do any more than prevent button spamming issues in currently open form.
	// A useEffect watching `cart` handles wiping the saved data if the cart is changed.
	const [savedConfigurationGroup, setSavedConfigurationGroup] = useState({ isValid: false })
	const setDefaultSavedConfigurationGroup = () => setSavedConfigurationGroup({ isValid: false })

	// Are we currently in the process of generating a link (for button busy status)
	const [generatingLink, setGeneratingLink] = useState(false)

	const { setMessage } = useContext(FlashMessageContext)

	useEffect(() => {
		setBaseUrl(getBaseUrlFromLocation(window.location))
	}, [])

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
		if (savedConfigurationGroup.isValid) {
			if (savedConfigurationGroup.itemIds.length !== cart.length) {
				setDefaultSavedConfigurationGroup()
			} else {
				for (let i = 0; i < cart.length; i++) {
					if (cart[i].id != savedConfigurationGroup.itemIds[i]) {
						setDefaultSavedConfigurationGroup()
						break
					}
				}
			}
		} else {
			// delete any errors that may have been set.
			setDefaultSavedConfigurationGroup()
		}
	}, [cart])

	const linkFromId = (groupId) => baseUrl + '/cart?quote=' + groupId

	const handleRemoveItem = (id) => {
		removeFromCart(id)
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
					const data = await response.json() // do I need this line?
					updateItem(itemId, { licence: newLicence })
				} catch (error) {
					console.error('Error updating licence.')
				}
			}
		}
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

	const asyncSaveConfigOnClickHandler = async () => {
		const configurations = cart.map((item) => item.id)
		if (configurations.length) {
			setGeneratingLink(true)
			try {
				const response = await fetch('/api/save-configuration-group', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ configurations }), // sending the configurations
				})
				if (response.ok) {
					const data = await response.json()
					setSavedConfigurationGroup({ id: data.id, itemIds: cart.map((item) => item.id), isValid: true })
				} else if (response.status === 410) {
					console.error(response)
					setSavedConfigurationGroup({
						error:
							'Very sorry, one or more items in the cart is outdated. Please try removing and re-adding the items.',
						isValid: false,
					})
				} else {
					setSavedConfigurationGroup({
						error: 'Very sorry, there was an error when generating a quote for these items.',
						isValid: false,
					})
				}
				setGeneratingLink(false)
			} catch (error) {
				setGeneratingLink(false)
				setSavedConfigurationGroup({
					error: 'Very sorry, an error occurred when generating a quote for these items.',
					isValid: false,
				})
			}
		}
	}

	const asyncCopyLinkOnClickHandler = async () => {
		if (savedConfigurationGroup.isValid) {
			try {
				await navigator.clipboard.writeText(linkFromId(savedConfigurationGroup.id))
				let element = document.getElementById(`${cartId}-link-text`)

				//show a bit of feedback on the link that was copied
				element.classList.remove(styles.copySuccess) // Remove the class if it already present
				void element.offsetWidth // Trigger a reflow, flushing the CSS changes
				element.classList.add(styles.copySuccess) // (Re-)add the class
				// also show a flash message
				setMessage({ text: 'Link Copied', type: MessageType.INFO })

				// Seems very unlikely we'd have a transient write to clipboard error, but if we have had one, we clear it here.
				setSavedConfigurationGroup((prevState) => ({ ...prevState, error: undefined }))
			} catch (clipboardError) {
				console.error('Failed to copy text to clipboard:', clipboardError)
				//Leaves isValid set to true, so link will still be displayed - this is just an inability to write it to the clipboard.
				setSavedConfigurationGroup((prevState) => ({ ...prevState, error: 'Error: Could not write to clipboard.' }))
			}
		}
	}

	return (
		<form className={styles.cartContainer} onSubmit={(e) => e.preventDefault()}>
			<h2>Your Cart</h2>
			<small className='keyboardNote' aria-live='polite'>
				Note: Pressing Enter will not submit the form, please use the checkout button at the end.
			</small>
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
									data-tooltip-id={`remove-item-${cartId}-${item.id}`}
									data-tooltip-content='Remove Item'
									aria-describedby={`remove-item-sr-${cartId}-${item.id}`}>
									X
								</button>
								<Tooltip id={`remove-item-${cartId}-${item.id}`} />
								<span id={`remove-item-sr-${cartId}-${item.id}`} className='sr-only'>
									Remove Item
								</span>
								{`${displayName} - ${formatPriceFromPounds(item.price)}`}
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
			<fieldset>
				<legend>Total</legend>
				<div
					className={styles.configSave}
					style={{ visibility: !isCartLoading && getTotalItems() ? 'visible' : 'hidden' }}>
					{savedConfigurationGroup.isValid ? (
						<>
							{savedConfigurationGroup.error && (
								<span aria-live='polite' className={`${styles.configSaveText} formError`}>
									{savedConfigurationGroup.error}
								</span>
							)}
							<span id={`${cartId}-link-text`} className={styles.configSaveText}>
								{linkFromId(savedConfigurationGroup.id)}
							</span>
							<button
								type='button'
								disabled={!getTotalItems()}
								onClick={asyncCopyLinkOnClickHandler}
								data-tooltip-id={`copy-link-${cartId}`}
								data-tooltip-content='Copies the link that has been created to your clipboard.'
								aria-describedby={`copy-link-sr-${cartId}`}>
								Copy to Clipboard
							</button>
							<Tooltip id={`copy-link-${cartId}`} />
							<span id={`copy-link-sr-${cartId}`} className='sr-only'>
								Copies the link that has been created to your clipboard.
							</span>
						</>
					) : (
						<>
							{savedConfigurationGroup.error && (
								<span aria-live='polite' className={`${styles.configSaveText} formError`}>
									{savedConfigurationGroup.error}
								</span>
							)}
							<BusyButton
								type='button'
								isBusy={generatingLink}
								disabled={!getTotalItems()}
								onClick={asyncSaveConfigOnClickHandler}
								dataTooltipId={`create-link-${cartId}`}
								dataTooltipContent='Creates a link that can be used to restore the current contents of the cart - for sharing this quote.'
								aria-describedby={`create-link-sr-${cartId}`}>
								Create Link
							</BusyButton>
							<Tooltip id={`create-link-${cartId}`} />
							<span id={`create-link-sr-${cartId}`} className='sr-only'>
								Creates a link that can be used to restore the current contents of the cart - for sharing this quote.
							</span>
						</>
					)}
				</div>
				<div className={styles.checkout}>
					<p className={styles.total}>{`Total: ${formatPriceFromPounds(getTotalPrice())}`}</p>
					<CheckoutButton />
				</div>
			</fieldset>
		</form>
	)
}

export default CartDisplay
