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
						<img src='/images/logos/kerio-connect-logo.svg' alt='Kerio Connect' />
						<p>
							Perfectly tailored for small to medium-sized businesses, Kerio Connect is a trusted mail server and
							all-in-one collaboration tool. With its deployment in over 30,000 companies globally, it is compatible
							with a diverse range of operating systems, including Windows, macOS, and Linux.
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
						<img src='/images/logos/kerio-control-logo.svg' alt='Kerio Control' />
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
				</ul>
			</section>
		</Page>
	)
}

export default Home
