import React, { useState, useEffect } from 'react'
import { useAuth } from '/components/contexts/AuthContext'

import styles from '/styles/AdminBanner.module.css'

const AdminBanner = () => {
	const { user, isAuthLoading, asyncIsUserAdmin } = useAuth()
	const [isUserAdmin, setIsUserAdmin] = useState(null)
	const [isBannerOpen, setIsBannerOpen] = useState(true)

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
				<div className={styles.content}></div>
			</aside>
		)
	}

	// Show nothing to non admin user
	return null
}

export default AdminBanner
