import { connectToDatabase } from '../../server-utils/mongodb'
import { asyncGetConfiguration } from '../../server-utils/saveAndGetConfigurations'
import { VersioningError } from '../../utils/types/errors'

// This api is unsecured since we do not create an anonymous user for non logged in users before using it - maybe this should be changed
export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST')
		return res.status(405).end('Method Not Allowed - must be POST')
	}

	const { id } = req.body

	// Check if id is present and its first character is '1'
	if (!id || typeof id !== 'string' || id[0] !== '1') {
		res.status(400).json({ error: 'Invalid id' })
		return
	}

	try {
		const db = await connectToDatabase()
		const collection = db.collection('configuration_groups')

		// Look up the id in the configurations_group collection
		const record = await collection.findOne({ _id: id })

		// If no record is found
		if (!record) {
			res.status(404).json({ error: 'Record not found' })
			return
		}

		if (record?.configuration_version !== Number(process.env.CONFIGURATION_VERSION)) {
			res
				.status(410)
				.json({
					error: `Configuration group version mismatch.  Found ${record?.configuration_version} but needed ${Number(
						process.env.CONFIGURATION_VERSION
					)}`,
				})
			return
		}

		// Call asyncGetConfiguration on each element of configurations array
		const configurations = await Promise.all(record.configurations.map(asyncGetConfiguration))

		// Create an object where keys are values from record.configurations and values are from configurations
		const configurationsObject = record.configurations.reduce((obj, key, index) => {
			obj[key] = configurations[index]
			return obj
		}, {})

		// Return the configurations object
		res.status(200).json(configurationsObject)
	} catch (error) {
		// If asyncGetConfiguration throws a VersioningError
		if (error instanceof VersioningError) {
			res.status(410).json({ error: 'Configuration versioning error' })
		} else {
			// For other error conditions
			console.error(error)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
}
