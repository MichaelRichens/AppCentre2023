import React from 'react'
import Page from '../components/Page'
import { asyncPayPalConnect } from '../server-utils/paypal'

const Home = () => {
	asyncPayPalConnect()

	return (
		<Page title='Home'>
			<div id='your-container-element'></div>
			<p>Welcome to our home page!</p>
		</Page>
	)
}

export default Home
