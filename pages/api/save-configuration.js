import processConfiguration from '../../utils/processConfiguration'
import asyncFetchAndProcessProducts from '../../server-utils/fetchAndProcessProducts'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, productName, unitName, formData } = req.body
		if (productFamily && productFamily.length > 0 && unitName && formData) {
			/** @var {Object} freshProductData A trusted copy of the product data from the database, for the configuration options received from client side */
			const freshProductData = await asyncFetchAndProcessProducts(productFamily)
			const configuration = processConfiguration(
				productName,
				freshProductData.products,
				freshProductData.extensions,
				formData,
				unitName
			)
			console.log(configuration)
			res.status(200).json({ message: 'Valid objects received.' })
		} else {
			res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed.' })
	}
}
