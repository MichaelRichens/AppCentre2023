import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/NavLink.module.css'

/**
 * NavLink component wraps the passed element in a Next.js Link.
 * If the current page matches the passed href value, it applies an additional "current" CSS class and optionally a custom style.
 * Clicking the link on the current page will be prevented.
 *
 * @param {Object} props - Properties passed to the NavLink component.
 * @param {string} props.href - The target URL for the NavLink.
 * @param {string?} props.role - An optional role attribute to apply to the resulting anchor tag.
 * @param {string?} props.currentPageStyle - Optional custom style to apply when the NavLink is for the current page (by default will remove standard link styling).
 * @param {React.ReactNode} props.children - The content to be wrapped in the NavLink.
 * @returns {React.Element} The NavLink component with appropriate styling and behavior based on the current page.
 */
const NavLink = ({ href, role, currentPageStyle, children }) => {
	const router = useRouter()
	const isCurrentPage = router.pathname === href

	const handleCurrentPageClick = (event) => {
		event.preventDefault()
	}

	if (isCurrentPage) {
		return (
			<Link
				href={href}
				role={role}
				className={`${styles.current}${currentPageStyle ? ' ' + currentPageStyle : ''}`}
				aria-current='page'
				onClick={handleCurrentPageClick}>
				{children}
			</Link>
		)
	}
	return <Link href={href}>{children}</Link>
}

export default NavLink
