import processConfiguration from '../../utils/processConfiguration'
import asyncFetchAndProcessProducts from '../../server-utils/fetchAndProcessProducts'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { productFamily, unitName, formData } = req.body
		if (productFamily && productFamily.length > 0 && unitName && formData) {
			const freshProductData = await asyncFetchAndProcessProducts(productFamily)
			res.status(200).json({ message: 'Valid objects received.' })
		} else {
			res.status(400).json({ message: 'Required data not received.' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed.' })
	}
}
