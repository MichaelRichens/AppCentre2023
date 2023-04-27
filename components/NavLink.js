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
