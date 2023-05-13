import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Tooltip } from 'react-tooltip'
import { useShoppingCart } from 'use-shopping-cart'
import CartDisplay from './CartDisplay'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { cartCount } = useShoppingCart()
	const [isCartVisible, setCartVisible] = useState(false)
	const cartRef = useRef(null)
	const cartButtonRef = useRef(null)

	const handleCartClick = () => {
		if (cartCount > 0) {
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
		<aside id='headerCartContainer' className={`popupContainer ${headerStyles.headerCartContainer}`}>
			<button
				ref={cartButtonRef}
				className={headerStyles.cartIcon}
				onClick={handleCartClick}
				aria-label='Open Cart'
				disabled={cartCount === 0}
				data-tooltip-id='open-cart'
				data-tooltip-content='Click to Open Cart'>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='Shopping Cart' />
				<div
					aria-live='polite'
					className={`${headerStyles.cartCount} ${cartCount > 0 ? headerStyles.cartFull : headerStyles.cartEmpty}`}>
					<span className='sr-only'>Quantity in Cart: </span>
					{cartCount}
				</div>
			</button>
			{!isCartVisible && cartCount > 0 && <Tooltip id='open-cart' />}
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
		</aside>
	)
}

export default HeaderCartMenu
