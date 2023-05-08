import React from 'react'
import Link from 'next/link'
import styles from '../styles/Footer.module.css'

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
						/ Second Chance PC Ltd. Company number 4331031. Registered for VAT GB 783705210.
					</small>
				</div>
			</footer>
		</>
	)
}

export default Footer
