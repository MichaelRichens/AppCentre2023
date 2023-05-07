import React from 'react'
import NavLink from './NavLink'
import styles from '../styles/Header.module.css'
import DropdownMenu from './DropdownMenu'

const Header = () => {
	return (
		<header className={styles.header}>
			<div id='headerInnerWrapper' className={styles.headerInnerWrapper}>
				<div id='headerNavContainer' className={styles.headerNavContainer}>
					<nav aria-label='Info'>
						<ul>
							<li>
								<NavLink href='/' currentPageStyle={styles.currentPageStyle}>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink href='/about-us' currentPageStyle={styles.currentPageStyle}>
									About Us
								</NavLink>
							</li>
						</ul>
					</nav>
					<nav aria-label='Products'>
						<ul>
							<li>
								<DropdownMenu
									title='Kerio Connect'
									linkData={[
										{ linkText: 'Info', href: '/kerio-connect', currentPageStyle: styles.currentPageStyle },
										{ linkText: 'Pricing', href: '/kerio-connect-pricing', currentPageStyle: styles.currentPageStyle },
									]}
									className={styles.navDropdown}></DropdownMenu>
							</li>
							<li>
								<NavLink href='/kerio-control' currentPageStyle={styles.currentPageStyle}>
									Kerio Control
								</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-archiver' currentPageStyle={styles.currentPageStyle}>
									GFI Archiver
								</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-languard' currentPageStyle={styles.currentPageStyle}>
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
