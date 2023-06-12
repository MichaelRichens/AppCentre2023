import PricingType from '../../utils/types/enums/PricingType'
import PurchaseType from '../../utils/types/enums/PurchaseType'
import processConfiguration from '../../utils/processConfiguration'
import { asyncFetchAndProcessProducts } from '../../server-utils/asyncFetchAndProcessProducts'
import { asyncSaveConfiguration } from '../../server-utils/saveAndGetConfigurations'

// This api is unsecured since we do not create an anonymous user for non logged in users before using it - maybe this should be changed
export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, productOption, formData } = req.body
		if (productFamily && productFamily.length > 0 && formData) {
			let key
			let configuration
			try {
				// console.time('save-configuration TOTAL')
				/** @var {Object} freshProductData A trusted copy of the product data from the database, for the configuration options received from client side */
				// console.time('save-configuration await 1')
				const freshProductData = await asyncFetchAndProcessProducts(productFamily, productOption)
				console.log(formData)
				// Check for purchases using illegal methods (ie legacy products which are not allowed certain purchase types - these are blocked from being chosen client side, but we restrict here just to be sure)
				if (freshProductData.pricingType === PricingType.UNIT) {
					if (!freshProductData.allowNewPurchase && formData.unType === PurchaseType.NEW) {
						return res.status(410).json({ message: 'New purchase not allowed for this product.' })
					}

					if (
						!freshProductData.allowAddUnits &&
						(formData.unType === PurchaseType.ADD || (formData.unType === PurchaseType.SUB && formData.unitsChange > 0))
					) {
						return res.status(410).json({ message: 'Add units not allowed for this product.' })
					}
				}

				// console.timeEnd('save-configuration await 1')

				configuration = processConfiguration(freshProductData, formData)

				if (configuration.price <= 0) {
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
				price: configuration.price,
			})
		} else {
			return res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		return res.status(405).json({ message: 'Method not allowed, must be POST.' })
	}
}
