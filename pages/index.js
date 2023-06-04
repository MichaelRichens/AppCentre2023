import React from 'react'
import Page from '../components/page/Page'

const Home = () => {
	console.log('NEXT_PUBLIC_DEPLOY_PRIME_URL', process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL)
	console.log('NEXT_PUBLIC_DEPLOY_URL', process.env.NEXT_PUBLIC_DEPLOY_URL)
	return (
		<Page title='Home'>
			<p>Welcome to our home page! Testing, testing...</p>
		</Page>
	)
}

export default Home
