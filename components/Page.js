import React from 'react'
import Header from './Header'
import Footer from './Footer'

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
