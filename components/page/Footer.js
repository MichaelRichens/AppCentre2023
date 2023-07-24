import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '/styles/Footer.module.css'

const Footer = () => {
	const router = useRouter()

	return (
		<>
			<div role='none' className={styles.separator}></div>
			<footer className={styles.footer}>
				<div id='footerInnerWrapper' className='styles.footerInnerWrapper'>
					<div className={styles.contactDetails}>
						<h2>Contact Details</h2>
						<div className={styles.contactDetailsContent}>
							<div className={styles.phoneWeb}>
								<div>
									<strong>Tel:</strong>
								</div>
								<div>
									<strong>Email:</strong>{' '}
									{router?.pathname !== '/contact' ? (
										<Link href='/contact'>info@appcentre.co.uk</Link>
									) : (
										'info@appcentre.co.uk'
									)}
								</div>
								<div>
									<strong>Websites:</strong>
									<ul>
										<li>www.appcentre.co.uk</li>
										<li>
											<Link href='https://www.macupgrades.co.uk/store/'>www.macuprades.co.uk</Link>
										</li>
										<li>
											<Link href='https://www.solderfix.co.uk'>www.solderfix.co.uk</Link>
										</li>
									</ul>
								</div>
							</div>
							<div className={styles.address}>
								<strong>Address:</strong>
							</div>
						</div>
					</div>
					<div className={styles.smallPrintWrapper}>
						<small>
							© 2006 - {new Date().getFullYear()} Michael Richens. AppCentre was operated by Second Chance PC Ltd until
							2023.
						</small>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
