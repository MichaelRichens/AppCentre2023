import React from 'react'
import { LineWave } from 'react-loader-spinner'
import Page from './Page'

const LoadingPage = () => {
	return (
		<Page title='Loading...'>
			<div style={{ paddingLeft: '30%' }}>
				<LineWave width='600' height='600' color='#4fa94d' />
			</div>
		</Page>
	)
}

export default LoadingPage
