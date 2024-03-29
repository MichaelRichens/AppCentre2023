import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '/styles/DropdownMenu.module.css'
import NavLink from './NavLink'

/**
 *  @component
 * DropdownMenu component.
 *
 * A navigation menu item that displays a list of links in a dropdown
 * when hovered over. The dropdown will remain open if the current
 * page matches any of the links inside the dropdown.
 *
 * @example
 * // Sample usage in the parent component
 * <DropdownMenu
 *   title="Products"
 *   linkData={[
 *     { linkText: "Home", href: "/", currentPageStyle: styles.currentPageStyle },
 *     { linkText: "About Us", href: "/about-us", currentPageStyle: styles.currentPageStyle },
 *   ]}
 *   className={styles.navDropdown}
 * />
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - The title displayed for the menu item.
 * @param {Array<Object>} props.linkData - Array of objects containing link information.
 * @param {string} props.linkData[].linkText - The text to display for the link.
 * @param {string} props.linkData[].href - The URL to navigate to when the link is clicked.
 * @param {string} props.linkData[].currentPageStyle - The CSS class to apply when the current page matches the link.
 * @param {string?} props.className - Optional CSS class for the dropdown container.
 * @param {boolean?} props.navIsSingleRow - Optionally can be passed as `false` to prevent fixed open behaviour.
 */
const DropdownMenu = ({ title, linkData, className, navIsSingleRow }) => {
	const router = useRouter()
	const [showDropdown, setShowDropdown] = useState(false)
	const [isFixedOpen, setIsFixedOpen] = useState(false)
	const menuItemRef = useRef(null)
	if (navIsSingleRow === undefined || navIsSingleRow === null) {
		navIsSingleRow = true
	}

	useEffect(() => {
		const handleRouteChange = () => {
			const shouldShowDropdown = navIsSingleRow && linkData.some((data) => router.pathname === data.href)
			setIsFixedOpen(shouldShowDropdown)
			setShowDropdown(shouldShowDropdown)
		}

		handleRouteChange() // Call once on mount to set the initial state
		router.events.on('routeChangeComplete', handleRouteChange) // Listen for route changes

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange) // Clean up the listener on unmount
		}
	}, [router.pathname, linkData, router.events])

	const handleKeyDown = (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			setShowDropdown(!showDropdown)
		}
	}

	const handleBlur = (event) => {
		if (!menuItemRef.current.contains(event.relatedTarget)) {
			setShowDropdown(false)
		}
	}

	return (
		<div
			className={styles.menuItem}
			ref={menuItemRef}
			onMouseEnter={() => setShowDropdown(true)}
			onMouseLeave={() => {
				if (!isFixedOpen) {
					setShowDropdown(false)
				}
			}}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}>
			<button
				className={`${styles.menuTitle} ${isFixedOpen ? linkData[0].currentPageStyle : ''} ${
					showDropdown ? styles.menuTitleOpen : ''
				}`}
				aria-haspopup='true'
				aria-expanded={showDropdown}>
				<Image src='/images/icons/white-triangle-right100x100.png' height='10' width='10' alt='' loading='eager' />
				{title}
			</button>
			<div
				className={`${styles.dropdown} ${className} ${showDropdown ? styles.visibleDropdown : ''} ${
					!isFixedOpen ? styles.dropdownIsDefaultClosed : ''
				}`}
				aria-hidden={!showDropdown}>
				<div>
					{linkData.map((data, index) => (
						<div key={index} className={styles.link}>
							<NavLink href={data.href} currentPageStyle={data.currentPageStyle} tabIndex={-1}>
								{data.linkText}
							</NavLink>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default DropdownMenu
