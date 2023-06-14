import React from 'react'
import withAdminAuth from '/components/hoc/withAdminAuth'
import Page from '/components/page/Page'
import AdminOrders from '/components/admin/AdminOrders'

const Admin = () => {
	return (
		<Page title='Admin'>
			<p>Admin page</p>
			<AdminOrders />
		</Page>
	)
}

export default withAdminAuth(Admin)
