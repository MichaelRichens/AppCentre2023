import getHardcodedProductData from '../../utils/getHardcodedProductData'
import processConfiguration from '../../utils/processConfiguration'
import asyncFetchAndProcessProducts from '../../server-utils/fetchAndProcessProducts'
import { saveConfiguration } from '../../server-utils/saveAndGetConfigurations'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, unitName, formData } = req.body
		if (productFamily && productFamily.length > 0 && unitName && formData) {
			let key
			try {
				/** @var {Object} freshProductData A trusted copy of the product data from the database, for the configuration options received from client side */
				const freshProductData = await asyncFetchAndProcessProducts(productFamily)
				// getHardcodedProductData pulls from an env variable to translate productFamily to the product display name - do this to ensure that the name we display for a purchase line item matches the skus that are part of it
				// Can't prevent someone from passing junk into this api, but at least anything that comes out of it should have a price and skus which match its name.
				const hardcodedProductData = getHardcodedProductData()
				const configuration = processConfiguration(
					hardcodedProductData[productFamily].name,
					freshProductData.products,
					freshProductData.extensions,
					formData,
					unitName
				)
				key = await saveConfiguration(configuration)
			} catch (error) {
				res.status(500).json({ message: 'An error occurred when fetching or processing data.' })
			}
			res.status(200).json({ key: key })
		} else {
			res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed.' })
	}
}
