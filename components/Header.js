import React from 'react'
import NavLink from './NavLink'

const Header = () => {
  return (
    <header>
      <div id='header-nav-container'>
        <nav aria-label='Primary navigation'>
          <ul>
            <li>
              <NavLink href='/'>Home</NavLink>
            </li>
            <li>
              <NavLink href='/about-us'>About Us</NavLink>
            </li>
          </ul>
        </nav>
        <nav aria-label='Product navigation'>
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
      </div>
    </header>
  )
}

export default Header
