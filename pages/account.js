import React from 'react'
import Page from '../components/Page'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const Account = () => {
	return (
		<Page title='My Account'>
			<SignIn />
			<SignUp />
		</Page>
	)
}

export default Account
