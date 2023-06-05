import React, { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import accountStyles from '/styles/Account.shared.module.css'

function SignInOrSignUp() {
	return (
		<div className={accountStyles.SignInOrSignUp}>
			<SignIn title='Log into your account:' />
			<SignUp title='Or create an account here:' />
		</div>
	)
}

export default SignInOrSignUp
