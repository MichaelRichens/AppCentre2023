import React from 'react'
import Page from '../components/page/Page'
import withAuth from '../components/hoc/withAuth'
import { useAuth } from '../components/contexts/AuthContext'
import accountStyles from '../styles/Account.shared.module.css'

const Account = () => {
	const { user } = useAuth()
	return (
		<Page title='My Account' mainClassName={accountStyles.accountDetailsPage}>
			<section>
				<ul>
					<li>
						<strong>Your Email:</strong> {user.email || 'Not Set'}
					</li>
				</ul>
			</section>
		</Page>
	)
}

export default withAuth(Account)
