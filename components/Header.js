import React from 'react'
import NavLink from './NavLink'

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink href='/'>Home</NavLink>
          </li>
          <li>
            <NavLink href='/about-us'>About Us</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
