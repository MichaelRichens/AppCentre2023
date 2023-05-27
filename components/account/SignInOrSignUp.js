import React, { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import accountStyles from '../../styles/Account.shared.module.css'

function SignInOrSignUp() {
	return (
		<div className={accountStyles.SignInOrSignUp}>
			<SignIn />
			<h2>Or create an account here:</h2>
			<SignUp />
		</div>
	)
}

export default SignInOrSignUp
