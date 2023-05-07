import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/DropdownMenu.module.css'
import NavLink from './NavLink'

/**
 * DropdownMenu component.
 *
 * A navigation menu item that displays a list of links in a dropdown
 * when hovered over. The dropdown will remain open if the current
 * page matches any of the links inside the dropdown.
 *
 * @component
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
 * @param {string?} [props.className] - Optional CSS class for the dropdown container.
 */
const DropdownMenu = ({ title, linkData, className }) => {
	const router = useRouter()
	const [showDropdown, setShowDropdown] = useState(false)

	// Check if any of the links match the current route
	const isOpenByRoute = linkData.some((data) => router.pathname === data.href)

	useEffect(() => {
		setShowDropdown(isOpenByRoute)
	}, [router.pathname, linkData])

	const toggleDropdown = () => {
		if (!isOpenByRoute) {
			setShowDropdown(!showDropdown)
		}
	}

	return (
		<div className={styles.menuItem} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
			<div className={styles.menuTitle}>{title}</div>
			{showDropdown && (
				<div className={`${styles.dropdown} ${className}`}>
					{linkData.map((data, index) => (
						<div key={index} className={styles.link}>
							<NavLink href={data.href} currentPageStyle={data.currentPageStyle}>
								{data.linkText}
							</NavLink>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default DropdownMenu
