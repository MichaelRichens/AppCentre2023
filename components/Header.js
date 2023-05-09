import React, { useRef } from 'react'
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
					<nav aria-label='Products'>
						<ul ref={productUlRef}>
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
			</div>
		</header>
	)
}

export default Header
