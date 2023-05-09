import React from 'react'
import DropdownMenu from './DropdownMenu'
import headerStyles from '../styles/Header.shared.module.css'

/**
 * @component
 * Simple component for generating a DropdownMenu component for the set of pages for a product in the header.
 * Basically just to make it simpler to write, with less props passed in.
 *
 * @param {Object} props - The component props.
 * @param {string} props.hrefStart - The unique first part of the product urls, eg '/kerio-connect' which.
 * @param {boolean?} props.allowFixedOpen - Optionally can be passed as `false` to prevent fixed open behaviour.
 * @returns {JSX.Element} The component.
 */
const ProductDropdown = ({ hrefStart, allowFixedOpen, children }) => {
	return (
		<DropdownMenu
			title={children}
			linkData={[
				{ linkText: 'Info', href: hrefStart, currentPageStyle: headerStyles.currentPageStyle },
				{
					linkText: 'Pricing',
					href: `${hrefStart}-pricing`,
					currentPageStyle: headerStyles.currentPageStyle,
				},
			]}
			className={headerStyles.navDropdown}
			allowFixedOpen={allowFixedOpen}
		/>
	)
}

export default ProductDropdown
