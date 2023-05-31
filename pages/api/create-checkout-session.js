import Error from 'next/error'
import * as firebaseAdmin from 'firebase-admin'
import { stripe } from '../../server-utils/initStripe'
import firebaseService from '../../server-utils/firebaseService'
import { VersioningError } from '../../utils/types/errors'
import OrderStatus from '../../utils/types/enums/OrderStatus'
import { asyncGetConfiguration } from '../../server-utils/saveAndGetConfigurations'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'
import { ensureFirebaseInitialised } from '../../server-utils/firebaseAdminSDKInit'

ensureFirebaseInitialised()

export default async (req, res) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		return res.status(405).end('Method Not Allowed - must be POST')
	}

	const decodedToken = await asyncDecodeFirebaseToken(req?.headers?.authorization)

	if (!decodedToken) {
		if (decodedToken === null) {
			console.error('create-checkout-session endpoint. Invalid authorization header format.')
			return res.status(401).end('Not Authorised.')
		}
		console.error('create-checkout-session endpoint. Error when verifying token with firebase')
		return res.status(403).end('Forbidden')
	}

	try {
		const cartFromClientSide = req.body?.items
		const customerFromClientSide = req.body?.customerDetails

		// for storing in the orders collection in firestore
		let orderObject = {}
		if (customerFromClientSide?.firebaseUserId) {
			if (decodedToken.uid !== customerFromClientSide.firebaseUserId) {
				console.error('create-checkout-session endpoint. Error token did not match passed user id.')
				return res.status(403).end('Forbidden')
			}

			orderObject.firebaseUserId = customerFromClientSide.firebaseUserId
		}

		// Verify product data with backend

		if (!cartFromClientSide || !Array.isArray(cartFromClientSide)) {
			console.error('Invalid request body. Expected "items" array.')
			return res.status(400).json({ message: 'Invalid request.' })
		}

		let trustedConfigurations
		try {
			trustedConfigurations = Object.fromEntries(
				await Promise.all(cartFromClientSide.map(async (item) => [item.id, await asyncGetConfiguration(item.id)]))
			)
		} catch (error) {
			if (error instanceof VersioningError) {
				return res.status(410).json({ message: 'A requested configuration is outdated an cannot be returned.' })
			} else {
				console.error('Failed to fetch fresh product data from the database.', error)
				throw error
			}
		}

		orderObject.line_items = { ...trustedConfigurations }

		// do we have anything to ship

		let isShipping = false

		for (let key in trustedConfigurations) {
			if (trustedConfigurations[key].hasOwnProperty('isShipping') && trustedConfigurations[key].isShipping === true) {
				isShipping = true
				break
			}
		}

		orderObject.isShipping = isShipping

		if (isShipping) {
			orderObject.shippingPrice = 0 // free shipping is all we're doing
		}

		// Create an array of product line items for the Stripe checkout session
		const line_items = Object.keys(trustedConfigurations).map((id) => {
			const configuration = trustedConfigurations[id]
			const itemName = configuration.description + (configuration?.licence.length ? ` (${configuration.licence})` : '')

			if (
				!configuration ||
				!configuration.summary ||
				!configuration.summary ||
				!configuration.price ||
				!itemName ||
				typeof configuration.price !== 'number'
			) {
				console.error(`Invalid product data for ID ${id}`)
				throw new Error(`Invalid product data for ID ${id}`)
			}

			const priceInPence = Math.round(configuration.price * 100)

			// not using quantities at present - cart doesn't even have the concept
			const quantity = 1

			const metadata = {
				internalId: id,
				configuration: configuration.unType,
				units: configuration.units,
				years: configuration.years,
				skus: JSON.stringify(configuration.skus),
			}

			return {
				price_data: {
					currency: process.env.NEXT_PUBLIC_CURRENCY_LC,
					product_data: {
						name: itemName,
						metadata,
					},
					unit_amount: priceInPence,
				},
				quantity,
			}
		})

		// customer details

		let stripeCustomerId = false
		if (customerFromClientSide) {
			if (customerFromClientSide?.stripeCustomerId) {
				stripeCustomerId = customerFromClientSide.stripeCustomerId
				orderObject.stripeCustomerId = stripeCustomerId
			}
		}

		// cancel url
		let cancelUrl = process.env.NEXT_PUBLIC_DEPLOY_URL + '/cart'

		if (req.headers.referer) {
			const url = new URL(req.headers.referer)
			cancelUrl = process.env.NEXT_PUBLIC_DEPLOY_URL + url.pathname + url.search + url.hash
		}

		let sessionCreationObj = {
			payment_method_types: ['card'],
			line_items,
			mode: 'payment',
			success_url: `${process.env.NEXT_PUBLIC_DEPLOY_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: cancelUrl,
			billing_address_collection: 'required',
			invoice_creation: {
				enabled: true,
				invoice_data: {
					/*account_tax_ids: [process.env.NEXT_PUBLIC_VAT_NUMBER],*/
					footer: `AppCentre is a trading name of Second Chance PC Ltd.  Company Number: ${process.env.NEXT_PUBLIC_COMPANY_NUMBER}. Registered for VAT: ${process.env.NEXT_PUBLIC_VAT_NUMBER}. E&OE.`,
					rendering_options: {
						amount_tax_display: 'exclude_tax',
					},
				},
			},
			submit_type: 'pay',
		}

		if (customerFromClientSide?.firebaseUserId) {
			sessionCreationObj.client_reference_id = customerFromClientSide.firebaseUserId
		}

		if (isShipping) {
			sessionCreationObj['shipping_address_collection'] = {
				allowed_countries: process.env.NEXT_PUBLIC_SHIPPING_COUNTRIES.split(','),
			}
		}

		// include the user's stripe customer id if they have one, or their email if not and we have that
		if (stripeCustomerId) {
			sessionCreationObj.customer = stripeCustomerId
			sessionCreationObj.customer_update = { address: 'auto', name: 'auto', shipping: 'auto' }
		} else if (customerFromClientSide?.email) {
			sessionCreationObj.customer_email = customerFromClientSide.email
		}

		let session

		try {
			// Create a Stripe checkout session
			session = await stripe.checkout.sessions.create(sessionCreationObj)
		} catch (stripeError) {
			// Handle errors from the Stripe API separately

			if (
				stripeError.type === 'StripeInvalidRequestError' &&
				stripeError.code === 'resource_missing' &&
				stripeError.param === 'customer' &&
				stripeError.detail === undefined
			) {
				delete sessionCreationObj.customer
				delete orderObject.stripeCustomerId
				if (customerFromClientSide?.firebaseUserId) {
					// Delete the stripeCustomerId field from this user's firestore record, since this stripe customer record does not seem to exist any more
					try {
						const userRef = firebaseService.collection('users').doc(customerFromClientSide.firebaseUserId)
						userRef.update({
							stripeCustomerId: firebaseAdmin.firestore.FieldValue.delete(),
							updatedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
						})
					} catch (firebaseError) {
						console.error('Error deleting stripe user id from firebase', firebaseError)
						// Non fatal error, will continue with checkout
					}
				}
				try {
					session = await stripe.checkout.sessions.create(sessionCreationObj)
				} catch (stillStripeError) {
					console.error('Still get stripe error after deleting not-found customer id.', stillStripeError)
					return res.status(500).json({ message: `Stripe API error: ${stillStripeError.message}` })
				}
			} else {
				console.error('Stripe API Error:', stripeError)
				return res.status(500).json({ message: `Stripe API error: ${stripeError.message}` })
			}
		}

		orderObject.sessionId = session.id

		orderObject.status = OrderStatus.CHECKOUT

		// store the order with firestore

		try {
			// parse/stringify is just to convert custom objects into plain javascript objects for firestore (must be done before adding timestamps)
			const plainObject = JSON.parse(JSON.stringify(orderObject))

			// must do after the conversion to a plain object
			plainObject.createdAt = firebaseAdmin.firestore.FieldValue.serverTimestamp()
			plainObject.updatedAt = firebaseAdmin.firestore.FieldValue.serverTimestamp()

			// add it to orders collection
			await firebaseService.collection('orders').add(plainObject)
		} catch (error) {
			console.error('Error inserting document in firestore:', error)
			throw error
		}

		// Return the session ID
		return res.status(200).json({ sessionId: session.id, url: session.url })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ statusCode: 500, message: 'Internal Error' })
	}
}
