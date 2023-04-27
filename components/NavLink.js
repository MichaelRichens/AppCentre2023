/**
 * Returns the passed element wrapped link if the current page does not match the passed href value, and unchanged if it does.
 */
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const NavLink = ({ href, children }) => {
  const router = useRouter()
  const isCurrentPage = router.pathname === href

  if (isCurrentPage) {
    return <>{children}</>
  }
  return <Link href={href}>{children}</Link>
}

export default NavLink
