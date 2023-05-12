import React, { useState } from 'react'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'
import CartDisplay from './CartDisplay'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { cartCount } = useShoppingCart()
	const [isCartVisible, setCartVisible] = useState(false)

	const handleCartClick = () => {
		if (cartCount > 0) {
			setCartVisible(!isCartVisible)
		}
	}

	const handleCartClose = () => {
		setCartVisible(false)
	}

	return (
		<aside id='headerCartContainer' className={headerStyles.headerCartContainer}>
			<button
				className={headerStyles.cartIcon}
				onClick={handleCartClick}
				aria-label='Open cart'
				title='Click to Open'
				disabled={cartCount === 0}>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='Shopping Cart' />
				<div
					aria-label='Items in Cart'
					className={`${headerStyles.cartCount} ${cartCount > 0 ? headerStyles.cartFull : headerStyles.cartEmpty}`}>
					{cartCount}
				</div>
			</button>
			{isCartVisible && (
				<div className={headerStyles.cartWrapper}>
					<button onClick={handleCartClose} className={headerStyles.closeButton} aria-label='Close cart'>
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
