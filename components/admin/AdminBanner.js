import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '/components/contexts/AuthContext'

import styles from '/styles/AdminBanner.module.css'

const AdminBanner = () => {
	const router = useRouter()
	const { user, isAuthLoading, asyncIsUserAdmin } = useAuth()
	const [isUserAdmin, setIsUserAdmin] = useState(null)
	const [isBannerOpen, setIsBannerOpen] = useState(true)
	const [bannerMessage, setBannerMessage] = useState('')
	const [bannerLinks, setBannerLinks] = useState([])

	useEffect(() => {
		if (isUserAdmin) {
			if (router.pathname.startsWith('/order/')) {
				const { orderId } = router.query
				setBannerMessage('Viewing customer order page as an admin.')
				const adminLink = `/admin/order${orderId}`
				setBannerLinks((prev) => {
					const alreadyExists = prev.some((linkObj) => linkObj.link === adminLink)

					if (!alreadyExists) {
						return [...prev, { link: adminLink, text: `Admin page for ${orderId}` }]
					}

					return prev
				})
			}
		}
	}, [router.pathname, isUserAdmin])

	useEffect(() => {
		if (isAuthLoading || !user) {
			return
		}
		setIsUserAdmin(asyncIsUserAdmin())
	}, [user, isAuthLoading])

	if (isUserAdmin) {
		return (
			<aside className={`${styles.banner} ${!isBannerOpen ? styles.bannerCollapsed : ''}`}>
				<button type='button' className={styles.openCloseButton} onClick={() => setIsBannerOpen((prev) => !prev)}>
					{isBannerOpen ? '< Close' : 'Open >'}
				</button>
				<h2>Admin</h2>
				<div className={styles.content}>
					{!!bannerMessage && <p>{bannerMessage}</p>}
					{!!bannerLinks.length && (
						<ul className={styles.links}>
							<li>
								<strong>Links:</strong>
							</li>
							{bannerLinks.map((linkObj) => (
								<li>
									<Link href={linkObj.link}>{linkObj.text}</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</aside>
		)
	}

	// Show nothing to non admin user
	return null
}

export default AdminBanner
