import React from 'react'
import { useEffect } from 'react'
import smartquotes from 'smartquotes'
import Header from './Header'
import Footer from './Footer'

/**
 * Page is a wrapper component that renders a title, header, footer, and the children components.
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title to display on the page.
 * @param {string?} props.subHeading - Optional. A supplement to the main title.
 * @param {React.ReactNode} props.children - The child components to render within the page.
 * @returns {JSX.Element} The Page component.
 */
const Page = ({ title, subHeading, children }) => {
	// This converts standard quotes into smart quotes in all text displayed.
	useEffect(() => {
		smartquotes().listen()
	}, [])
	return (
		<>
			<Header />
			<main>
				<h1>{title}</h1>
				{subHeading && subHeading.length > 0 && <p className='subHeading'>{subHeading}</p>}
				{children}
			</main>
			<Footer />
		</>
	)
}

export default Page
