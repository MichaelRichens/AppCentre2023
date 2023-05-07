// pages/api/store-configuration.js
/*
import { isProductConfiguration } from '../../utils/typeCheck'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { formData, clientSideConfiguration } = req.body

		if (formData !== null && clientSideConfiguration !== null && isProductConfiguration(clientSideConfiguration)) {
			res.status(200).json({ message: 'Valid objects received' })
		} else {
			res.status(400).json({ message: 'Invalid objects received' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' })
	}
}
*/
