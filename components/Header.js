import React from 'react'
import NavLink from './NavLink'
import headerStyles from '../styles/Header.shared.module.css'
import ProductDropdown from './ProductDropdown'

const Header = () => {
	return (
		<header className={headerStyles.header}>
			<div id='headerInnerWrapper' className={headerStyles.headerInnerWrapper}>
				<div id='headerNavContainer' className={headerStyles.headerNavContainer}>
					<nav aria-label='Info'>
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
						<ul>
							<li>
								<ProductDropdown hrefStart='/kerio-connect'>Kerio Connect</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/kerio-control'>Kerio Control</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/gfi-archiver'>GFI Archiver</ProductDropdown>
							</li>
							<li>
								<ProductDropdown hrefStart='/gfi-languard'>GFI LanGuard</ProductDropdown>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	)
}

export default Header
