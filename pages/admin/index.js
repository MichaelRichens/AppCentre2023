import React from 'react'
import withAdminAuth from '/components/hoc/withAdminAuth'
import Page from '/components/page/Page'

const Admin = () => {
	return (
		<Page title='Admin'>
			<p>Admin page</p>
		</Page>
	)
}

export default withAdminAuth(Admin)
