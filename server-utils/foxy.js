const FoxySDK = require('@foxy.io/sdk')

let cachedApi

/**
 * @warning The returned object contains sensitive foxy.io credentials in its properties and must never leak client side.
 * @returns {FoxySDK.Backend.API}
 */
function getFoxyApi() {
	if (cachedApi) {
		return cachedApi
	}

	cachedApi = new FoxySDK.Backend.API({
		refreshToken: process.env.FOXY_REFRESH_TOKEN,
		clientSecret: process.env.FOXY_CLIENT_SECRET,
		clientId: process.env.FOXY_CLIENT_ID,
	})

	return cachedApi
}

export { getFoxyApi }
