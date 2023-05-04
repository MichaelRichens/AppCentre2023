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
        <ul>
          <li>
            <NavLink href='/kerio-connect'>Kerio Connect</NavLink>
          </li>
          <li>
            <NavLink href='/kerio-control'>Kerio Control</NavLink>
          </li>
          <li>
            <NavLink href='/gfi-archiver'>GFI Archiver</NavLink>
          </li>
          <li>
            <NavLink href='/gfi-languard'>GFI LanGuard</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
