import React from 'react'
import Page from '../components/Page'
import PayPalButton from '../components/PayPalButton'

const Home = () => {
	return (
		<Page title='Home'>
			<div>
				<PayPalButton configId='test_config' />
			</div>
			<p>Welcome to our home page!</p>
		</Page>
	)
}

export default Home
