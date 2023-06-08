import React from 'react'
import Link from 'next/link'
import styles from '/styles/Footer.module.css'

const Footer = () => {
	return (
		<>
			<div role='none' className={styles.separator}></div>
			<footer className={styles.footer}>
				<div id='footerInnerWrapper'>
					<small>
						© 2006 - {new Date().getFullYear()} AppCentre. AppCentre is a part of{' '}
						<Link href='https://www.macupgrades.co.uk/store/' target='_blank' rel='noopener'>
							MacUpgrades
						</Link>{' '}
						/ Second Chance PC Ltd. Company Number: {process.env.NEXT_PUBLIC_COMPANY_NUMBER}. Registered for VAT:{' '}
						{process.env.NEXT_PUBLIC_VAT_NUMBER}. See our <Link href='/privacy'>privacy policy</Link>.
					</small>
				</div>
			</footer>
		</>
	)
}

export default Footer
