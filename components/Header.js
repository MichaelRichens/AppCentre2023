import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const Header = () => {
	const router = useRouter()

	const isActive = href => router.pathname === href

	return (
		<header>
			<nav>
				<ul>
					<li>
						<Link
							href="/"
							className={isActive("/") ? "active-link" : ""}
						>
							Home
						</Link>
					</li>
					<li>
						<Link
							href="/about-us"
							className={
								isActive("/about-us") ? "active-link" : ""
							}
						>
							About Us
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header
