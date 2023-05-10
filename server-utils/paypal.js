import { loadScript } from '@paypal/paypal-js'
import PromisePonyfill from 'promise-polyfill'

let paypal

const asyncPayPalConnect = async () => {
	const options = { 'client-id': 'test' }
	try {
		paypal = await loadScript(options, PromisePonyfill)
	} catch (error) {
		console.error('failed to load the PayPal JS SDK script', error)
	}

	if (paypal) {
		try {
			await paypal.Buttons().render('#your-container-element')
		} catch (error) {
			console.error('failed to render the PayPal Buttons', error)
		}
	}
}

export { asyncPayPalConnect }
