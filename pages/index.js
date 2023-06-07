import React from 'react'
import Link from 'next/link'
import Page from '../components/page/Page'
import styles from '/styles/Home.module.css'

const Home = () => {
	return (
		<Page
			mainClassName={styles.home}
			title='Welcome to AppCentre'
			subHeading='Purchasing GFI & Kerio Software the Easy Way'>
			<section className='text'>
				<p>
					We are a GFI Software Gold Partner, and have been selling Kerio solutions since the mid 2000s. If you need to
					quickly and easily price up a new purchase or renewal of a Kerio or GFI software solution, you have come to
					the right place. Just enter your requirements into one of our configurators, and get a total price
					immediately.
				</p>
			</section>
			<section className={styles.products}>
				<ul>
					<li>
						<Link className={styles.imgLink} href='/kerio-connect'>
							<img src='/images/logos/kerio-connect-logo.svg' alt='Kerio Connect' />
						</Link>
						<p>
							Perfectly tailored for small to medium-sized businesses, Kerio Connect is a trusted mail server and
							all-in-one collaboration tool, with deployments in over 30,000 companies globally.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/kerio-connect'>Info</Link>
							</li>
							<li>
								<Link href='/kerio-connect-pricing'>Pricing</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link className={styles.imgLink} href='/kerio-control'>
							<img src='/images/logos/kerio-control-logo.svg' alt='Kerio Control' />
						</Link>
						<p>
							Kerio Control is a next-generation firewall and unified threat management product, developed specifically
							for small and medium-sized businesses seeking a comprehensive solution to their security needs.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/kerio-control'>Info</Link>
							</li>
							<li>
								<Link href='/kerio-control-pricing'>Pricing</Link>
							</li>
							<li>
								<Link href='/kerio-control-box'>Hardware</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link className={styles.imgLink} href='/gfi-archiver'>
							<img src='/images/logos/gfi-archiver-logo.svg' alt='GFI Archiver' />
						</Link>
						<p>
							GFI Archiver is a robust and comprehensive software solution designed to securely store and manage your
							business's electronic communications.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/gfi-archiver'>Info</Link>
							</li>
							<li>
								<Link href='/gfi-archiver-pricing'>Pricing</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link className={styles.imgLink} href='/gfi-helpdesk'>
							<img src='/images/logos/gfi-helpdesk-logo.svg' alt='GFI HelpDesk' />
						</Link>
						<p>
							GFI HelpDesk is a robust, self-hosted service desk solution that consolidates and streamlines support
							functionality.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/gfi-helpdesk'>Info</Link>
							</li>
							<li>
								<Link href='/gfi-helpdesk-pricing'>Pricing</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link className={styles.imgLink} href='/gfi-mailessentials'>
							<img src='/images/logos/gfi-mailessentials-logo.svg' alt='GFI MailEssentials' />
						</Link>
						<p>
							GFI MailEssentials is a comprehensive and robust email security solution designed to protect your business
							from email-borne threats.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/gfi-mailessentials'>Info</Link>
							</li>
							<li>
								<Link href='/gfi-mailessentials-pricing'>Pricing</Link>
							</li>
						</ul>
					</li>
					<li>
						<Link className={styles.imgLink} href='/gfi-languard'>
							<img src='/images/logos/gfi-languard-logo.svg' alt='GFI LanGuard' />
						</Link>
						<p>
							GFI LanGuard provides comprehensive network scanning, patch management, and vulnerability assessment
							capabilities to help you maintain a secure and compliant IT environment.
						</p>
						<ul className={styles.prodLinks}>
							<li>
								<Link href='/gfi-languard'>Info</Link>
							</li>
							<li>
								<Link href='/gfi-languard-pricing'>Pricing</Link>
							</li>
						</ul>
					</li>
				</ul>
			</section>
		</Page>
	)
}

export default Home
