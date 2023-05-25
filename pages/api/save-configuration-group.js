import { connectToDatabase } from '../../server-utils/mongodb'
import generateKey from '../../utils/generateKey'

const currentConfigVersion = Number(process.env.CONFIGURATION_VERSION)

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).end() // Method Not Allowed
		return
	}

	const { configurations } = req.body

	if (!Array.isArray(configurations)) {
		res.status(400).json({ error: 'Invalid configurations' }) // Bad Request
		return
	}

	const { db } = await connectToDatabase()

	const configCollection = db.collection('configurations')
	const groupCollection = db.collection('configuration_groups')

	for (const config of configurations) {
		const configRecord = await configCollection.findOne({ _id: config })

		if (!configRecord) {
			res.status(404).json({ error: `Configuration ${config} not found` }) // Not Found
			return
		}

		if (configRecord?.configuration_version !== currentConfigVersion) {
			res.status(410).json({ error: `Configuration ${config} is outdated` }) // Gone
			return
		}
	}

	let id
	do {
		id = '1' + generateKey(5)
	} while (await groupCollection.findOne({ _id: id }))

	const newGroup = {
		_id: id,
		configurations: configurations,
		configuration_version: currentConfigVersion,
	}

	try {
		await groupCollection.insertOne(newGroup)
	} catch (error) {
		console.error('Failed to create configuration group:', error)
		res.status(500).json({ error: 'Failed to create configuration group' }) // Internal Server Error
		return
	}

	res.status(200).json({ id })
}
