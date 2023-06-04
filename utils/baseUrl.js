/**
 * @function
 * This is a helper function which sanitises the host url from an api routes req object against env variables which hold the urls that Netlify (or localhost development) have set during the build process
 * that the site is deployed to. If one of them matches, then it is returned, otherwise the main public url for the site (NEXT_PUBLIC_URL) is returned (will be localhost during local development).
 * This is intended to allow things like Stripe integration, that require us to supply return urls, to be properly tested without having to manually change the urls (and risk not changing them back to production settings)
 *
 * @param {Object} req - A request object passed to an api route - function is only interested in req.headers
 * @returns {string} - The base url that the request came from, as long as it is guaranteed to be one that the site is actually deployed to.  If it fails that test, it well return process.env.NEXT_PUBLIC_URL
 */
export function baseUrlFromReq(req) {
	const { headers } = req
	const host = headers && headers.host
	const protocol = headers['x-forwarded-proto'] || 'https'
	const headersUrl = `${protocol}://${host}`

	let baseUrl

	switch (headersUrl) {
		case process.env.NEXT_PUBLIC_URL:
			baseUrl = process.env.NEXT_PUBLIC_URL
			break
		case process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL:
			baseUrl = process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL
			break
		case process.env.NEXT_PUBLIC_DEPLOY_URL:
			baseUrl = process.env.NEXT_PUBLIC_DEPLOY_URL
			break
		default:
			baseUrl = process.env.NEXT_PUBLIC_URL
			console.warn(
				`A request was received that with its headers claiming the host url was: ${headersUrl} - we substituted with ${baseUrl}`
			)
	}

	return baseUrl
}

/**
 * This function returns a valid base URL, given a Location object (like window.location).
 * It checks the URL against environment variables that hold valid possible domains we might be running on.
 * If no match is found, it defaults to process.env.NEXT_PUBLIC_URL.
 *
 * @param {Location} location - A Location object, like window.location.
 * @returns {string} - A valid base URL.
 */
export function getBaseUrlFromLocation(location) {
	const { protocol, host } = location
	const locationUrl = `${protocol}//${host}`

	let baseUrl

	switch (locationUrl) {
		case process.env.NEXT_PUBLIC_URL:
			baseUrl = process.env.NEXT_PUBLIC_URL
			break
		case process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL:
			baseUrl = process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL
			break
		case process.env.NEXT_PUBLIC_DEPLOY_URL:
			baseUrl = process.env.NEXT_PUBLIC_DEPLOY_URL
			break
		default:
			baseUrl = process.env.NEXT_PUBLIC_URL
	}

	return baseUrl
}
