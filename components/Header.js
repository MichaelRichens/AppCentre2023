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
								<ProductDropdown title='Kerio Connect' hrefStart='/kerio-connect' />
							</li>
							<li>
								<NavLink href='/kerio-control' currentPageStyle={headerStyles.currentPageStyle}>
									Kerio Control
								</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-archiver' currentPageStyle={headerStyles.currentPageStyle}>
									GFI Archiver
								</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-languard' currentPageStyle={headerStyles.currentPageStyle}>
									GFI LanGuard
								</NavLink>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	)
}

export default Header
