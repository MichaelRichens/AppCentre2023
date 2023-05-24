import { asyncUpdateRecord } from '../../server-utils/mongodb'

export default async function handler(req, res) {
	const { id, licence } = req.body

	if (!id || typeof id !== 'string' || id.length === 0) {
		return res.status(400).json({ error: 'Invalid or missing id.' })
	}

	if (!('licence' in req.body)) {
		return res.status(400).json({ error: 'Licence must be provided.' })
	}

	const licenceToUpdate = licence === null || licence === '' || typeof licence !== 'string' ? undefined : licence

	try {
		await asyncUpdateRecord('configurations', id, { licence: licenceToUpdate })
		return res.status(200).json({ message: 'Configuration licence updated successfully.' })
	} catch (error) {
		console.error('Error updating configuration licence:', error)
		return res.status(500).json({ error: 'Failed to update configuration licence.' })
	}
}
