/**
 * Returns the passed element wrapped link if the current page does not match the passed href value, and unchanged if it does.
 */
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/NavLink.module.css'

const NavLink = ({ href, children }) => {
	const router = useRouter()
	const isCurrentPage = router.pathname === href

	const handleCurrentPageClick = (event) => {
		event.preventDefault()
	}

	if (isCurrentPage) {
		return (
			<Link href={href} className={styles.current} aria-current='page' onClick={handleCurrentPageClick}>
				{children}
			</Link>
		)
	}
	return <Link href={href}>{children}</Link>
}

export default NavLink
