import React from 'react'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { cartCount } = useShoppingCart()

	return (
		<aside id='headerCartContainer' className={headerStyles.headerCartContainer}>
			<div className={headerStyles.cartIcon}>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='' />
				<div className={`${headerStyles.cartCount} ${cartCount > 0 ? headerStyles.cartFull : headerStyles.cartEmpty}`}>
					{cartCount}
				</div>
			</div>
		</aside>
	)
}

export default HeaderCartMenu
