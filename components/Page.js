import React from 'react'
import { useEffect } from 'react'
import Head from 'next/head'
import smartquotes from 'smartquotes'
import Header from './Header'
import Footer from './Footer'

/**
 * Page is a wrapper component that renders a title, header, footer, and the children components.
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title to display on the page.
 * @param {string=} props.subHeading - Optional. A supplement to the main title.
 * @param {string=} props.logoSrc - Optional.  The path to an image file to display as a logo beside the title
 * @param {string=} props.mainClassName - Optional. A css class to apply to the main element.
 * @param {React.ReactNode} props.children - The child components to render within the page.
 * @returns {JSX.Element} The Page component.
 */
const Page = ({ title, subHeading, logoSrc, mainClassName, children }) => {
	// This converts standard quotes into smart quotes in all text displayed.
	useEffect(() => {
		smartquotes().listen()
	}, [])
	return (
		<>
			<Head>
				<title>{`AppCentre: ${title}`}</title>
				<link rel='apple-touch-icon' sizes='180x180' href='/images/icons/favicons/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/images/icons/favicons/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/images/icons/favicons/favicon-16x16.png' />
				<link rel='manifest' href='/images/icons/favicons/site.webmanifest' />
				<link rel='mask-icon' href='/images/icons/favicons/safari-pinned-tab.svg' color='#5bbad5' />
				<link rel='shortcut icon' href='/images/icons/favicons/favicon.ico' />
				<meta name='msapplication-TileColor' content='#da532c' />
				<meta name='msapplication-config' content='/images/icons/favicons/browserconfig.xml' />
				<meta name='theme-color' content='#ffffff' />
			</Head>
			<Header />
			<main className={mainClassName}>
				<div className='titleWrapper'>
					{logoSrc && <img src={logoSrc} />}
					<h1>{title}</h1>
					{logoSrc && <img src={logoSrc} />}
				</div>

				{subHeading && subHeading.length > 0 && <p className='h1SubHeading'>{subHeading}</p>}
				{children}
			</main>
			<Footer />
		</>
	)
}

export default Page
