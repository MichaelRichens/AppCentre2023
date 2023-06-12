import React, { useContext, useRef } from 'react'
import useIsAtLeastTwiceChildHeight from '../hooks/useIsAtLeastTwiceChildHeight'
import FlashMessage from '../FlashMessage'
import HeaderCartMenu from './HeaderCartMenu'
import NavLink from '../NavLink'
import ProductDropdown from '../ProductDropdown'
import DropdownMenu from '../DropdownMenu'
import CheckoutButton from '../CheckoutButton'
import SignOutButton from '../account/SignOutButton'
import { useAuth } from '../contexts/AuthContext'
import { CartContext } from '../contexts/CartContext'
import headerStyles from '/styles/Header.shared.module.css'

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
				<div className={headerStyles.headerMainContent}>
					<div
						ref={topLinksRef}
						className={`${headerStyles.topLinks} ${topLinksIsMultiRow ? headerStyles.multiRowTopLinks : ''}`}>
						<nav className={headerStyles.infoMenu} aria-label='Info'>
							<ul>
								<li>
									<NavLink href='/' currentPageStyle={headerStyles.currentPageStyle}>
										Home
									</NavLink>
								</li>
								<li>
									<NavLink href='/ordering' currentPageStyle={headerStyles.currentPageStyle}>
										Ordering
									</NavLink>
								</li>
								<li>
									<NavLink href='/contact' currentPageStyle={headerStyles.currentPageStyle}>
										Contact Us
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
							<img className={headerStyles.mainLogo} src='/images/logos/appcentre-logo.svg' alt='AppCentre' />
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
								<DropdownMenu
									title='Kerio Control'
									linkData={[
										{ linkText: 'Info', href: '/kerio-control', currentPageStyle: headerStyles.currentPageStyle },
										{
											linkText: 'Pricing',
											href: '/kerio-control-pricing',
											currentPageStyle: headerStyles.currentPageStyle,
										},
										{
											linkText: 'Hardware',
											href: '/kerio-control-box',
											currentPageStyle: headerStyles.currentPageStyle,
										},
									]}
									className={`${headerStyles.navDropdown} ${
										productNavIsMultiRow ? headerStyles.navDropdownNoFixedOpen : ''
									}`}
									navIsSingleRow={!productNavIsMultiRow}
								/>
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
							<li>
								<DropdownMenu
									title='Legacy Products'
									linkData={[
										{
											linkText: 'Kerio Operator',
											href: '/kerio-operator',
											currentPageStyle: headerStyles.currentPageStyle,
										},
										{
											linkText: 'GFI Unlimited',
											href: '/gfi-unlimited',
											currentPageStyle: headerStyles.currentPageStyle,
										},
									]}
									className={`${headerStyles.navDropdown} ${
										productNavIsMultiRow ? headerStyles.navDropdownNoFixedOpen : ''
									}`}
									navIsSingleRow={!productNavIsMultiRow}
								/>
							</li>
						</ul>
					</nav>
				</div>
				<aside className='cartSection'>
					<HeaderCartMenu />
					<div className={headerStyles.gfiPartnerLogoContainer}>
						<img src='/images/logos/gfi-gold-partner.svg' alt='GFI Gold Partner' />
					</div>
				</aside>
			</div>
		</header>
	)
}

export default Header
