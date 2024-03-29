import { ConfigurationSummaryUnit, ConfigurationSummaryHardSub } from '../utils/types/ConfigurationSummary'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import PricingType from '../utils/types/enums/PricingType'
import { VersioningError } from '../utils/types/errors'
import { generateAlphaId } from '../utils/generateId'
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

		// generate a key and check that it doesn't already exist, repeating until one is found
		let uniqueKey = generateAlphaId(6)
		let existingConfig = await collection.findOne({ _id: uniqueKey })

		while (existingConfig) {
			uniqueKey = generateAlphaId(6)
			existingConfig = await collection.findOne({ _id: uniqueKey })
		}

		configuration.configuration_version = Number(process.env.NEXT_PUBLIC_CONFIGURATION_VERSION)

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

		if (!configurationData.pricingType) {
			throw new Error('Saved configuration did not have a pricingType.')
		}

		const receivedConfigVersion = configurationData?.configuration_version

		if (
			!(typeof receivedConfigVersion === 'number') ||
			receivedConfigVersion < Number(process.env.NEXT_PUBLIC_CONFIGURATION_VERSION)
		) {
			throw new VersioningError(
				'Configuration version mismatch',
				receivedConfigVersion,
				Number(process.env.NEXT_PUBLIC_CONFIGURATION_VERSION)
			)
		}

		return ProductConfiguration.fromRawProperties(configurationData)
	} catch (error) {
		if (!(error instanceof VersioningError)) {
			console.error('Unable to get configuration', error)
		}
		throw error
	}
}

export { asyncSaveConfiguration, asyncGetConfiguration }
