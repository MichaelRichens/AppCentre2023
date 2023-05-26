import React from 'react'
import Page from '../components/Page'
import withAuth from '../components/hoc/withAuth'

const Account = () => {
	return <Page title='My Account'></Page>
}

export default withAuth(Account)
