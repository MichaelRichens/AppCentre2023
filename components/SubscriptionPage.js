import React from 'react'

import Page from './Page'
import PriceTableWithUnits from './PriceTableWithUnits'
import SubscriptionConfigurator from './SubscriptionConfigurator'
import PricingType from '../utils/types/enums/PricingType'

/**
 * ProductPage is a wrapper component that renders the Page component with a product configurator generated from the productFamily prop.
 * @param {Object} props - The component properties.
 * @param {string} props.productName - The name of the product, which will also be the title displayed on the page.
 * @param {JSX.Element} props.productIntro - A short intro to the product to be displayed at the top of the page, before the product configurator. HTML allowed, and should be included (will render inside a &lt;section&gt;).
 * @param {string} props.productFamily - The product family identifier.
 * @param {Object} props.productData - Products data from the database - pricing, skus etc.
 * @param {PricingType} props.pricingType - The type of pricing used for this product subscription.
 * @param {Word} props.unitName - An instance of the Word class representing the unit name in singular and plural forms.
 * @param {React.ReactNode} props.children - The child components to render within the page.*
 * @returns {JSX.Element} The ProductPage component.
 */
const SubscriptionPage = ({
  productName,
  productIntro,
  productFamily,
  productData,
  pricingType,
  unitName,
  children,
}) => {
  return (
    <Page title={productName}>
      <>
        <section>{productIntro}</section>
        <section>
          <h2 id='pricingHeading'>{productName} Pricing</h2>
          {pricingType === PricingType.UNIT ? (
            <PriceTableWithUnits
              productName={productName}
              productData={productData}
              unitName={unitName}
            />
          ) : null}
        </section>
        <section>
          <h2>{productName} Configurator</h2>
          <SubscriptionConfigurator
            productName={productName}
            productFamily={productFamily}
            productData={productData}
            unitName={unitName}
          />
        </section>
        {children}
      </>
    </Page>
  )
}

export default SubscriptionPage
