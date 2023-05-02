import React from 'react'

import Page from './Page'
import SubscriptionConfigurator from './SubscriptionConfigurator'

/**
 * ProductPage is a wrapper component that renders the Page component with a product configurator generated from the productFamily prop.
 * @param {Object} props - The component properties.
 * @param {string} props.productName - The name of the product, which will also be the title displayed on the page.
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {string} props.productFamily - The product family identifier.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @param {React.ReactNode} props.children - The child components to render within the page.
 * @returns {JSX.Element} The ProductPage component.
 */
const ProductPage = ({
  productName,
  productIntro,
  productFamily,
  productData,
  children,
}) => {
  return (
    <Page title={productName}>
      <>
        <section>{productIntro}</section>
        <SubscriptionConfigurator
          productName={productName}
          productFamily={productFamily}
          productData={productData}
        />
        {children}
      </>
    </Page>
  )
}

export default ProductPage
