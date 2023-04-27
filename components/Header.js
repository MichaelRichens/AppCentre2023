import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Header = () => {
  const router = useRouter()

  const isActive = (href) => router.pathname === href

  return (
    <header>
      <nav>
        <ul>
          <li>{isActive('/') ? 'Home' : <Link href='/'>Home</Link>}</li>
          <li>
            {isActive('/about-us') ? (
              'About Us'
            ) : (
              <Link href='/about-us'>About Us</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
