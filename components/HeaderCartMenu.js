import React, { useState, useEffect, useContext, useRef } from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import { CartContext } from './contexts/CartContext'
import CartDisplay from './CartDisplay'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { isCartLoading, getTotalItems } = useContext(CartContext)

	const [isCartVisible, setCartVisible] = useState(false)
	const cartRef = useRef(null)
	const cartButtonRef = useRef(null)

	const handleCartClick = () => {
		if (getTotalItems() > 0) {
			setCartVisible(!isCartVisible)
		}
	}

	const handleCartClose = () => {
		setCartVisible(false)
	}

	const handleClickOutside = (event) => {
		if (
			cartButtonRef.current &&
			!cartRef.current.contains(event.target) &&
			!cartButtonRef.current.contains(event.target)
		) {
			handleCartClose()
		}
	}

	useEffect(() => {
		if (isCartVisible) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		// cleanup function
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isCartVisible])

	return (
		<div className={`popupContainer ${headerStyles.headerCartContainer}`}>
			<button
				style={{ visibility: isCartLoading() || !getTotalItems() ? 'hidden' : 'visible' }}
				ref={cartButtonRef}
				className={headerStyles.cartIcon}
				onClick={handleCartClick}
				aria-label='Open Cart'
				disabled={isCartLoading() || getTotalItems() === 0}
				data-tooltip-id='open-cart'
				data-tooltip-content='Click to Open Cart'>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='Shopping Cart' />
				<div
					aria-live='polite'
					className={`${headerStyles.cartCount} ${
						!isCartLoading() && getTotalItems() ? headerStyles.cartFull : headerStyles.cartEmpty
					}`}>
					<span className='sr-only'>Quantity in Cart: </span>
					{!isCartLoading() ? getTotalItems() : 0}
				</div>
			</button>
			{!isCartVisible && getTotalItems() > 0 && <Tooltip id='open-cart' />}
			{isCartVisible && (
				<div ref={cartRef} className={`popupWrapper ${headerStyles.cartWrapper}`}>
					<button onClick={handleCartClose} className='popupCloseButton' aria-label='Close cart'>
						X
					</button>
					<div className={headerStyles.cart}>
						<CartDisplay />
					</div>
				</div>
			)}
		</div>
	)
}

export default HeaderCartMenu
