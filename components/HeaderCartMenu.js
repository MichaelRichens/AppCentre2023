import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'
import CartDisplay from './CartDisplay'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { cartCount } = useShoppingCart()
	const [isCartVisible, setCartVisible] = useState(false)
	const leaveTimeout = useRef(null)

	const handleMouseEnter = () => {
		if (leaveTimeout.current) {
			clearTimeout(leaveTimeout.current)
		}
		setCartVisible(true)
	}

	const handleMouseLeave = () => {
		leaveTimeout.current = setTimeout(() => {
			setCartVisible(false)
		}, 500) // adjust the delay time as needed
	}

	return (
		<aside id='headerCartContainer' className={headerStyles.headerCartContainer}>
			<div className={headerStyles.cartIcon} onMouseEnter={handleMouseEnter}>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='Shopping Cart' />
				<div
					aria-label='Items in Cart'
					className={`${headerStyles.cartCount} ${cartCount > 0 ? headerStyles.cartFull : headerStyles.cartEmpty}`}>
					{cartCount}
				</div>
			</div>
			<div className={headerStyles.cartWrapper} onMouseLeave={handleMouseLeave}>
				<div className={`${headerStyles.cart} ${isCartVisible ? headerStyles.open : ''}`}>
					<CartDisplay />
				</div>
			</div>
		</aside>
	)
}

export default HeaderCartMenu
