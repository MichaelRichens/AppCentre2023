import React, { useState } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

function SignInOrSignUp() {
	return (
		<>
			<h2>Please login to your account</h2>
			<SignIn />
			<h2>Or create an account here</h2>
			<SignUp />
		</>
	)
}

export default SignInOrSignUp
