import React from 'react'
import Page from '../components/page/Page'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const Login = () => {
	return (
		<Page title='Login'>
			<SignIn />
			<SignUp />
		</Page>
	)
}

export default Login
