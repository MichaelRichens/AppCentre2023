import React from 'react'
import Header from './Header'
import Footer from './Footer'

/**
 * Page is a wrapper component that renders a title, header, footer, and the children components.
 * @param {Object} props - The component properties.
 * @param {string} props.title - The title to display on the page.
 * @param {React.ReactNode} props.children - The child components to render within the page.
 * @returns {JSX.Element} The Page component.
 */
const Page = ({ title, children }) => {
  return (
    <>
      <Header />
      <main>
        <h1>{title}</h1>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Page
