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

	const addUniqueBannerLink = (newLinkObj) => {
		setBannerLinks((prev) => {
			const alreadyExists = prev.some((linkObj) => linkObj.link === newLinkObj.link)
			if (!alreadyExists) {
				return [...prev, newLinkObj]
			}
			return prev
		})
	}

	useEffect(() => {
		if (isUserAdmin) {
			addUniqueBannerLink({ link: '/admin', text: 'Admin Main Page' })

			if (router.pathname.startsWith('/order/')) {
				const { orderId } = router.query
				setBannerMessage('Viewing customer order page as an admin.')
				addUniqueBannerLink({ link: `/admin/order${orderId}`, text: `Admin Page for ${orderId}` })
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
					{!!bannerLinks.length && (
						<ul className={styles.links}>
							<li>
								<strong>Links:</strong>
							</li>
							{bannerLinks.map((linkObj) => (
								<li key={linkObj.link}>
									<Link href={linkObj.link}>{linkObj.text}</Link>
								</li>
							))}
						</ul>
					)}
					{!!bannerMessage && <p>{bannerMessage}</p>}
				</div>
			</aside>
		)
	}

	// Show nothing to non admin user
	return null
}

export default AdminBanner
