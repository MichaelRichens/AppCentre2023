import React, { useRef } from 'react'
import Image from 'next/image'
import useIsAtLeastTwiceChildHeight from './hooks/useIsAtLeastTwiceChildHeight'
import NavLink from './NavLink'
import headerStyles from '../styles/Header.shared.module.css'
import ProductDropdown from './ProductDropdown'

const Header = () => {
	const productUlRef = useRef(null)
	const productNavIsMultiRow = useIsAtLeastTwiceChildHeight(productUlRef)

	return (
		<header className={headerStyles.header}>
			<div id='headerInnerWrapper' className={headerStyles.headerInnerWrapper}>
				<div id='headerNavContainer' className={headerStyles.headerNavContainer}>
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

					<div className={headerStyles.logoContainer}>
						<NavLink href='/' currentPageStyle={headerStyles.mainLogoLinkCurrent}>
							<img className={headerStyles.mainLogo} src='images/logos/appcentre-logo-raleway.svg' alt='AppCentre' />
						</NavLink>
					</div>

					<nav aria-label='Products'>
						<ul ref={productUlRef} className={productNavIsMultiRow && headerStyles.multiRowProductNav}>
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
								<ProductDropdown hrefStart='/gfi-languard' navIsSingleRow={!productNavIsMultiRow}>
									GFI LanGuard
								</ProductDropdown>
							</li>
						</ul>
					</nav>
				</div>
				<div id='headerCartContainer' className={headerStyles.headerCartContainer}>
					<Image src='/images/icons/shopping_cart_icon100x100.png' height='30' width='30' alt='' />
				</div>
			</div>
		</header>
	)
}

export default Header
