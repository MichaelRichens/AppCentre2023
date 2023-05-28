import React, { useContext, useRef } from 'react'
import useIsAtLeastTwiceChildHeight from '../hooks/useIsAtLeastTwiceChildHeight'
import FlashMessage from '../FlashMessage'
import HeaderCartMenu from './HeaderCartMenu'
import NavLink from '../NavLink'
import ProductDropdown from '../ProductDropdown'
import CheckoutButton from '../CheckoutButton'
import SignOutButton from '../account/SignOutButton'
import { useAuth } from '../contexts/AuthContext'
import { CartContext } from '../contexts/CartContext'
import headerStyles from '../../styles/Header.shared.module.css'

const Header = () => {
	const topLinksRef = useRef(null)
	const productUlRef = useRef(null)
	const topLinksIsMultiRow = useIsAtLeastTwiceChildHeight(topLinksRef)
	const productNavIsMultiRow = useIsAtLeastTwiceChildHeight(productUlRef)
	const { isCartLoading, getTotalItems } = useContext(CartContext)
	const { user, isAuthLoading } = useAuth()

	return (
		<header className={headerStyles.header}>
			<FlashMessage />
			<div id='headerInnerWrapper' className={headerStyles.headerInnerWrapper}>
				<div id='headerMainContent' className={headerStyles.headerMainContent}>
					<div
						ref={topLinksRef}
						id='topLinks'
						className={`${headerStyles.topLinks} ${topLinksIsMultiRow ? headerStyles.multiRowTopLinks : ''}`}>
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
							</ul>
						</nav>
						<nav className={headerStyles.accountMenu} aria-label='Account Menu'>
							<ul>
								<li>
									<NavLink href='/account' currentPageStyle={headerStyles.currentPageStyle}>
										Account
									</NavLink>
								</li>
								<li style={{ display: isAuthLoading || !user ? 'none' : 'list-item' }}>
									<SignOutButton />
								</li>
								<li style={{ display: isCartLoading || !getTotalItems() ? 'none' : 'list-item' }}>
									<CheckoutButton />
								</li>
							</ul>
						</nav>
					</div>

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
								<ProductDropdown hrefStart='/gfi-mailessentials' navIsSingleRow={!productNavIsMultiRow}>
									GFI MailEssentials
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