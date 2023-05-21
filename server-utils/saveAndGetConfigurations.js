import ConfigurationSummary from '../utils/types/ConfigurationSummary'
import { ProductConfigurationUnit } from '../utils/types/ProductConfiguration'
import PricingType from '../utils/types/enums/PricingType'
import generateKey from '../utils/generateKey'
import { connectToDatabase } from './mongodb'

/**
 * Save a product configuration object to the MongoDB 'configurations' collection.
 * @param {ProductConfigurationUnit} configuration - The product configuration object to save.
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
 * @returns {Promise<ProductConfigurationUnit>} The retrieved product configuration object.
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

		switch (configurationData.pricingType) {
			case PricingType.UNIT:
				const { unType, units, years, _price: price, skus, summary } = configurationData

				const summaryInstance = ConfigurationSummary.fromProperties(summary)

				return new ProductConfigurationUnit(unType, units, years, price, skus, summaryInstance)
			default:
				throw new Error(`Unknown pricingType: ${configurationData.pricingType}`)
		}
	} catch (error) {
		console.error('Unable to get configuration', error)
		throw error
	}
}

export { asyncSaveConfiguration, asyncGetConfiguration }
