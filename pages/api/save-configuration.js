import processConfiguration from '../../utils/processConfiguration'
import { asyncFetchAndProcessProducts } from '../../server-utils/asyncFetchAndProcessProducts'
import { asyncSaveConfiguration } from '../../server-utils/saveAndGetConfigurations'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, productOption, formData } = req.body
		if (productFamily && productFamily.length > 0 && formData) {
			let key
			let configuration
			let price
			try {
				// console.time('save-configuration TOTAL')
				/** @var {Object} freshProductData A trusted copy of the product data from the database, for the configuration options received from client side */
				// console.time('save-configuration await 1')
				const freshProductData = await asyncFetchAndProcessProducts(productFamily, productOption)

				// console.timeEnd('save-configuration await 1')

				configuration = processConfiguration(freshProductData, formData)
				price = Math.round(configuration.price)
				if (price <= 0) {
					return res
						.status(422)
						.json({ message: 'The passed configuration options do not create a product with a price greater than 0.' })
				}
				// console.time('save-configuration await 2')
				key = await asyncSaveConfiguration(configuration)
				// console.timeEnd('save-configuration await 2')
			} catch (error) {
				console.error(error)
				return res
					.status(500)
					.json({ message: 'An error occurred when fetching or processing data.', error: error.message })
			}
			// console.timeEnd('save-configuration TOTAL')
			return res.status(200).json({
				key: key,
				name: configuration.description,
				price: price,
			})
		} else {
			return res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		return res.status(405).json({ message: 'Method not allowed, must be POST.' })
	}
}
