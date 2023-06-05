import Page from '../page/Page'
import SignInOrSignUp from '../account/SignInOrSignUp'
import { useAuth } from '../contexts/AuthContext'
import LoadingPage from '../page/LoadingPage'

import accountStyles from '/styles/Account.shared.module.css'

const withAuth = (Component) => {
	return (props) => {
		const { user, isAuthLoading } = useAuth()

		// Render a loading page while waiting for hydration to check auth status
		if (isAuthLoading) {
			return <LoadingPage />
		}

		// Render the component only if the user is authenticated
		// `user` ia a full logged in user, useAuth has a separate anonymousUser variable for them
		// but we'll check anyway, in case its possible somehow for a downgrade to happen that we haven't spotted
		if (user && !user?.isAnonymous) {
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
