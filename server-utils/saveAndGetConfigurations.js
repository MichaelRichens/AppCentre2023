import ProductConfiguration from '../utils/types/ProductConfiguration'
import generateKey from '../utils/generateKey'
import { connectToDatabase } from './mongodb'

/**
 * Save a product configuration object to the MongoDB 'configurations' collection.
 * @param {ProductConfiguration} configuration - The product configuration object to save.
 * @returns {Promise<string>} The unique key of the saved configuration.
 */
async function saveConfiguration(configuration) {
	const client = await connectToDatabase()
	const db = client.db()
	const collection = db.collection('configurations')

	let uniqueKey = generateKey(6)
	let existingConfig = await collection.findOne({ _id: uniqueKey })

	while (existingConfig) {
		uniqueKey = generateKey(6)
		existingConfig = await collection.findOne({ _id: uniqueKey })
	}

	await collection.insertOne({ ...configuration, _id: uniqueKey })

	return uniqueKey
}

/**
 * Retrieve a product configuration object from the MongoDB 'configurations' collection using its unique key.
 * @param {string} uniqueKey - The unique key of the configuration to retrieve.
 * @returns {Promise<ProductConfiguration>} The retrieved product configuration object.
 * @throws {Error} If a configuration with the provided key is not found.
 */
async function getConfiguration(uniqueKey) {
	const client = await connectToDatabase()
	const db = client.db()
	const collection = db.collection('configurations')

	const configurationData = await collection.findOne({ _id: uniqueKey })

	if (!configurationData) {
		throw new Error('Configuration not found.')
	}

	const { type, users, years, price, skus, summary } = configurationData

	return new ProductConfiguration(type, users, years, price, skus, summary)
}

export { saveConfiguration, getConfiguration }
