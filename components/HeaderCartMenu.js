import React from 'react'
import Image from 'next/image'
import { useShoppingCart } from 'use-shopping-cart'
import headerStyles from '../styles/Header.shared.module.css'

const HeaderCartMenu = () => {
	const { cartCount } = useShoppingCart()

	return (
		<aside id='headerCartContainer' className={headerStyles.headerCartContainer}>
			<div>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='' />
			</div>
		</aside>
	)
}

export default HeaderCartMenu
