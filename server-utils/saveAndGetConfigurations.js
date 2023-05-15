import ConfigurationSummary from '../utils/types/ConfigurationSummary'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import generateKey from '../utils/generateKey'
import { connectToDatabase } from './mongodb'

/**
 * Save a product configuration object to the MongoDB 'configurations' collection.
 * @param {ProductConfiguration} configuration - The product configuration object to save.
 * @returns {Promise<string>} The unique key of the saved configuration.
 */
async function asyncSaveConfiguration(configuration) {
	try {
		const db = await connectToDatabase()
		const collection = db.collection('configurations')

		let uniqueKey = generateKey(6)
		let existingConfig = await collection.findOne({ _id: uniqueKey })

		while (existingConfig) {
			uniqueKey = generateKey(6)
			existingConfig = await collection.findOne({ _id: uniqueKey })
		}

		await collection.insertOne({ ...configuration, _id: uniqueKey })

		return uniqueKey
	} catch (error) {
		console.error('Unable to save configuration', error)
		throw error
	}
}

/**
 * Retrieve a product configuration object from the MongoDB 'configurations' collection using its unique key.
 * @param {string} uniqueKey - The unique key of the configuration to retrieve.
 * @returns {Promise<ProductConfiguration>} The retrieved product configuration object.
 * @throws {Error} If a configuration with the provided key is not found.
 */
async function asyncGetConfiguration(uniqueKey) {
	try {
		const db = await connectToDatabase()
		const collection = db.collection('configurations')

		const configurationData = await collection.findOne({ _id: uniqueKey })

		if (!configurationData) {
			throw new Error('Configuration not found.')
		}

		const { type, units, years, price, skus, summary } = configurationData
		const summaryInstance = ConfigurationSummary.fromProperties(summary)

		return new ProductConfiguration(type, units, years, price, skus, summaryInstance)
	} catch (error) {
		console.error('Unable to get configuration', error)
		throw error
	}
}

export { asyncSaveConfiguration, asyncGetConfiguration }
