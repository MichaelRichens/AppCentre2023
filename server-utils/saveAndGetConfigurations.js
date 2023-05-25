import { ConfigurationSummaryUnit, ConfigurationSummaryHardSub } from '../utils/types/ConfigurationSummary'
import ProductConfiguration from '../utils/types/ProductConfiguration'
import PricingType from '../utils/types/enums/PricingType'
import { VersioningError } from '../utils/types/errors'
import generateKey from '../utils/generateKey'
import { connectToDatabase } from './mongodb'

const currentConfigVersion = Number(process.env.CONFIGURATION_VERSION)

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
		let uniqueKey = generateKey(6)
		let existingConfig = await collection.findOne({ _id: uniqueKey })

		while (existingConfig) {
			uniqueKey = generateKey(6)
			existingConfig = await collection.findOne({ _id: uniqueKey })
		}

		configuration.configuration_version = currentConfigVersion

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

		if (!(typeof receivedConfigVersion === 'number') || receivedConfigVersion < currentConfigVersion) {
			throw new VersioningError('Configuration version mismatch', receivedConfigVersion, currentConfigVersion)
		}

		switch (configurationData.pricingType) {
			case PricingType.UNIT: {
				configurationData.summary = ConfigurationSummaryUnit.fromProperties(configurationData.summary)
				break
			}
			case PricingType.HARDSUB: {
				configurationData.summary = ConfigurationSummaryHardSub.fromProperties(configurationData.summary)
				break
			}
			default:
				throw new Error(`Unknown pricingType: ${configurationData.pricingType}`)
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
