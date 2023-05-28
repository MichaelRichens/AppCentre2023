import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { Tooltip } from 'react-tooltip'
import { CartContext } from '../contexts/CartContext'
import CartDisplay from '../CartDisplay'
import headerStyles from '../../styles/Header.shared.module.css'
import { getModalBaseStyleObject } from '../../styles/modalBaseStyleObject'

const HeaderCartMenu = () => {
	const { isCartLoading, getTotalItems } = useContext(CartContext)
	const router = useRouter()

	const [modalIsOpen, setModalIsOpen] = useState(false)

	const openModal = () => {
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const modalStyles = getModalBaseStyleObject()

	return (
		<div className={headerStyles.headerCartContainer}>
			<button
				style={{ visibility: isCartLoading ? 'hidden' : 'visible' }}
				className={headerStyles.cartIcon}
				onClick={openModal}
				aria-label='Open Cart'
				disabled={isCartLoading || getTotalItems() === 0}
				data-tooltip-id='open-cart'
				data-tooltip-content='Click to Open Cart'>
				<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='Shopping Cart' />
				<div
					aria-live='polite'
					className={`${headerStyles.cartCount} ${
						!isCartLoading && getTotalItems() ? headerStyles.cartFull : headerStyles.cartEmpty
					}`}>
					<span className='sr-only'>Quantity in Cart: </span>
					{!isCartLoading ? getTotalItems() : 0}
				</div>
			</button>
			<Tooltip id='open-cart' />
			<Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
				<div className={`modalInnerWrapper ${headerStyles.cartWrapper}`}>
					{router.pathname !== '/cart' && (
						<p className={headerStyles.fullSizeCartLink}>
							<Link href='/cart'>Go to cart page</Link>
						</p>
					)}
					<button onClick={closeModal} className='modalCloseButton' aria-label='Close cart'>
						X
					</button>
					<div className={headerStyles.cart}>
						<CartDisplay />
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default HeaderCartMenu
