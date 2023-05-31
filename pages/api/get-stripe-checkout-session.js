import { stripe } from '../../server-utils/initStripe'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'

export default async (req, res) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		return res.status(405).end('Method Not Allowed - Must Be POST')
	}

	const sessionId = req?.body?.sessionId

	if (!sessionId || !(typeof sessionId === 'string') || sessionId.length === 0) {
		console.error('get-stripe-checkout endpoint received request without a valid sessionId set')
		res.status(400).end('Bad Request')
	}

	const decodedToken = await asyncDecodeFirebaseToken(req.headers.authorization)

	if (!decodedToken) {
		if (decodedToken === null) {
			console.error('get-stripe-checkout endpoint. Invalid authorization header format.')
			return res.status(401).end('Not Authorised.')
		}
		console.error('get-stripe-checkout endpoint. Error when verifying token with firebase')
		return res.status(403).end('Forbidden')
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId)

		// If the session has a client_reference_id the verify that it matches the authorisation
		// If not we basically skip the authorisation checks.  All our sessions should have these, so this is just trying to fail gracefully in case one didn't get set properly somehow.
		if (!session?.client_reference_id) {
			console.warn(
				`Stripe checkout session with id ${sessionId} does not have a client_reference_id set.  API was called by firebase user id ${decodedToken.uid}`
			)
		}
		if (session?.client_reference_id && session.client_reference_id !== decodedToken.uid) {
			return res.status(403).end('Forbidden')
		}

		return res.status(200).json({ session })
	} catch (error) {
		if (error?.type === 'StripeInvalidRequestError' && error?.code === 'resource_missing') {
			return res.status(404).end('Not Found')
		}
		console.error('get-stripe-checkout endpoint encountered an error requesting session from stripe.', error)
		return res.status(502).end('Bad Gateway')
	}
}
