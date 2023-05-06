import React from 'react'
import NavLink from './NavLink'
import styles from '../styles/Header.module.css'

const Header = () => {
	return (
		<header className={styles.header}>
			<div id='headerInnerWrapper'>
				<div id='headerNavContainer' className={styles.headerNavContainer}>
					<nav aria-label='Info'>
						<ul>
							<li>
								<NavLink href='/'>Home</NavLink>
							</li>
							<li>
								<NavLink href='/about-us'>About Us</NavLink>
							</li>
						</ul>
					</nav>
					<nav aria-label='Products'>
						<ul>
							<li>
								<NavLink href='/kerio-connect'>Kerio Connect</NavLink>
							</li>
							<li>
								<NavLink href='/kerio-control'>Kerio Control</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-archiver'>GFI Archiver</NavLink>
							</li>
							<li>
								<NavLink href='/gfi-languard'>GFI LanGuard</NavLink>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	)
}

export default Header
