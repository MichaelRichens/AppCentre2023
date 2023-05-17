import React, { useRef } from 'react'
import useIsAtLeastTwiceChildHeight from './hooks/useIsAtLeastTwiceChildHeight'
import useAllowCartStatus from './hooks/useAllowCartStatus'
import HeaderCartMenu from './HeaderCartMenu'
import NavLink from './NavLink'
import ProductDropdown from './ProductDropdown'
import CheckoutButton from './CheckoutButton'
import { useShoppingCart } from 'use-shopping-cart'
import headerStyles from '../styles/Header.shared.module.css'

const Header = () => {
	const productUlRef = useRef(null)
	const productNavIsMultiRow = useIsAtLeastTwiceChildHeight(productUlRef)
	const { cartCount } = useShoppingCart()
	const showCartWidget = useAllowCartStatus()

	return (
		<header className={headerStyles.header}>
			<div id='headerInnerWrapper' className={headerStyles.headerInnerWrapper}>
				<div id='headerMainContent' className={headerStyles.headerMainContent}>
					<nav className={headerStyles.infoMenu} aria-label='Info'>
						<ul>
							<li>
								<NavLink href='/' currentPageStyle={headerStyles.currentPageStyle}>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink href='/about-us' currentPageStyle={headerStyles.currentPageStyle}>
									About Us
								</NavLink>
							</li>
							{showCartWidget && cartCount > 0 && (
								<li className={headerStyles.pushRight}>
									<CheckoutButton />
								</li>
							)}
						</ul>
					</nav>

					<div className={headerStyles.logoContainer}>
						<NavLink href='/' currentPageStyle={headerStyles.mainLogoLinkCurrent}>
							<img className={headerStyles.mainLogo} src='images/logos/appcentre-logo.svg' alt='AppCentre' />
						</NavLink>
					</div>

					<nav aria-label='Products' className={headerStyles.productMenu}>
						<ul ref={productUlRef} className={productNavIsMultiRow ? headerStyles.multiRowProductNav : ''}>
							<li>
								<ProductDropdown hrefStart='/kerio-connect' navIsSingleRow={!productNavIsMultiRow}>
									Kerio Connect
								</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/kerio-control' navIsSingleRow={!productNavIsMultiRow}>
									Kerio Control
								</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/gfi-archiver' navIsSingleRow={!productNavIsMultiRow}>
									GFI Archiver
								</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/gfi-helpdesk' navIsSingleRow={!productNavIsMultiRow}>
									GFI HelpDesk
								</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/gfi-languard' navIsSingleRow={!productNavIsMultiRow}>
									GFI LanGuard
								</ProductDropdown>
							</li>
						</ul>
					</nav>
				</div>
				<aside id='headerRightSide'>
					<HeaderCartMenu />
					<div className={headerStyles.gfiPartnerLogoContainer}>
						<img src='images/logos/gfi-gold-partner.svg' alt='GFI Gold Partner' />
					</div>
				</aside>
			</div>
		</header>
	)
}

export default Header
