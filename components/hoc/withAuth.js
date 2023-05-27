import { LineWave } from 'react-loader-spinner'
import Page from '../Page'
import SignInOrSignUp from '../account/SignInOrSignUp'
import { useAuth } from '../contexts/AuthContext'

const withAuth = (Component) => {
	return (props) => {
		const { user, isAuthLoading } = useAuth()

		// Render a loading page while waiting for hydration to check auth status
		if (isAuthLoading) {
			return (
				<Page title='Loading...'>
					<div style={{ paddingLeft: '30%' }}>
						<LineWave width='400' height='200' color='#4fa94d' />
					</div>
				</Page>
			)
		}

		// Render the component only if the user is authenticated
		if (user) {
			return <Component {...props} />
		}

		return (
			<Page title='Please Log In'>
				<SignInOrSignUp />
			</Page>
		)
	}
}

export default withAuth
