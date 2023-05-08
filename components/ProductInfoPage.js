import React from 'react'
import Page from './Page'
import styles from '../styles/ProductInfoPage.module.css'

/**
 * @component
 * A component for generating an info page for a product.  It displays the children content alongside a configurator.
 * @param {Object} props - The component props.
 * @param {string} props.productFamily - The product family code.
 * @param {string} props.title - The title to display on the page.
 * @param {JSX.Element} props.children - The child components to render within the page.
 * @returns {JSX.Element} The ProductInfoPage component.
 */
const ProductInfoPage = ({ productFamily, title, children }) => {
	return <Page title={title}>{children}</Page>
}

export default ProductInfoPage
