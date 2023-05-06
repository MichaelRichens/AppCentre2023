import React from 'react'
import NavLink from './NavLink'
import styles from '../styles/Header.module.css'

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
								<NavLink href='/kerio-connect' currentPageStyle={styles.currentPageStyle}>
									Kerio Connect
								</NavLink>
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
