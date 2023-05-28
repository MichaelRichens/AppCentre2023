import { LineWave } from 'react-loader-spinner'
import Page from '../page/Page'
import SignInOrSignUp from '../account/SignInOrSignUp'
import { useAuth } from '../contexts/AuthContext'
import accountStyles from '../../styles/Account.shared.module.css'

const withAuth = (Component) => {
	return (props) => {
		const { user, isAuthLoading } = useAuth()

		// Render a loading page while waiting for hydration to check auth status
		if (isAuthLoading) {
			return (
				<Page title='Loading...'>
					<div style={{ paddingLeft: '30%' }}>
						<LineWave width='600' height='600' color='#4fa94d' />
					</div>
				</Page>
			)
		}

		// Render the component only if the user is authenticated
		if (user) {
			return <Component {...props} />
		}

		return (
			<Page title='Please Log In' mainClassName={accountStyles.authRequiredForAccess}>
				<SignInOrSignUp />
			</Page>
		)
	}
}

export default withAuth
