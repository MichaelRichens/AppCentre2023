import { connectToDatabase } from './mongodb'
import getHardcodedProductData from '../utils/getHardcodedProductData'

/**
 * Checks if a collection exists in the database.
 * @param {object} db - The MongoDB database object.
 * @param {string} collectionName - The name of the collection to check.
 * @returns {boolean} Returns true if the collection exists, false otherwise.
 */
async function collectionExists(db, collectionName) {
	// console.time('collectionExists await 1')
	const collections = await db.listCollections().toArray()
	// console.timeEnd('collectionExists await 1')
	return collections.some((collection) => collection.name === collectionName)
}

/**
 * Fetches data from one of the product data collections, querying based on the passed productFamily and productOption values
 * @param {string} collectionName - The collection to fetch, required.
 * @param {string|null} productFamily - If null, will return entire collection, otherwise only products which match this in their product_family field
 * @param {string|null} productOption - If null will just match on productFamily.  If set, will also match productOption on product_option BUT WILL ALSO return records without a product_option set.
 * @returns {Promise<Array<{_id: string, product_family: string, product_option?: string}>>} A promise that resolves to an array of objects each representing a document from the MongoDB collection with `_id` converted to a string.
 */
async function fetchFromProductDataCollection(collectionName, productFamily, productOption = null) {
	try {
		let db
		if (!collectionName) {
			throw new Error('No collection specified.')
		}
		try {
			// console.time('fetchCollection await 1')
			db = await connectToDatabase()
			// console.timeEnd('fetchCollection await 1')
		} catch (error) {
			console.error('Unable to connect to the database.', error)
			throw error
		}

		try {
			// console.time('fetchCollection await 2')
			const exists = await collectionExists(db, collectionName)
			// console.timeEnd('fetchCollection await 2')
			if (!exists) {
				throw new Error(`Collection ${collectionName} does not exist.`)
			}
		} catch (error) {
			console.error(error)
			throw error
		}

		try {
			const collection = db.collection(collectionName)

			let query
			if (productFamily === null) {
				query = {}
			} else if (productOption === null) {
				query = { product_family: productFamily }
			} else {
				query = {
					product_family: productFamily,
					$or: [{ family_option: productOption }, { family_option: { $exists: false } }, { family_option: '' }],
				}
			}
			const data = await collection.find(query).toArray()

			// Convert _id to string
			const dataWithStringIds = data.map((item) => {
				return { ...item, _id: item._id.toString() }
			})
			return dataWithStringIds
		} catch (error) {
			console.error('Error fetching data:', error)
			throw error
		}
	} catch (error) {
		console.error('fetchFromProductDataCollection failed with an error:', error)
		throw error
	}
}

/**
 * Processes all the skus for a gfi product and its extensions for use by the rest of the application
 * @function processProducts
 * @param {Object} data - An object with certain required and optional data about this gfi product, which supplements and/or overrides data in the other arrays
 * @param {Array} products - The array of product SKUs to process.
 * @param {Array} extensions - The array of extension SKUs to process.
 * @returns {Object} The processed products object with the following properties:
 * 	 @property {string} name - The name of this product, specific to the particular option if there is one
 * 	 @property {string} familyName - The general name of the product that covers all options
 * 	 @property {PricingType} pricingType - The type of pricing used for this product (ie does it have units)
 *   @property {Array} products - The individual product SKUs sorted by years (low to high) and then by user tier (low to high).
 *   @property {Array} extensions - The individual extension SKUs sorted by years (low to high) and then by name.
 *   @property {Array} availableExtensions - An array of unique extensions with a key generated from the extension name (spaces removed).
 *   @property {number} minUnits - The minimum number of units (eg users) supported by the products.
 *   @property {number} maxUnits - The maximum number of units (eg users) supported by the products.
 * 	 @property {number} minUnitsStep - The minimum number of units by which a subscription may be changed - ie 10 if you have to increase by 10s (would mean any value not ending in 0 is invalid)
 *   @property {number} minYears - The minimum number of years a subscription is available for.
 *   @property {number} maxYears - The maximum number of years a subscription is available for.
 */
const processProducts = (data, products, extensions) => {
	// We are working on the assumption that the data that comes from the database is valid - if there are things like a missing range of units for which a product that doesn't exist, or an extension that doesn't have skus that match all the years that there are product skus for, these cases have not been accounted for and results will mess up in interesting ways
	//This sorting is important, it being done is relied on elsewhere

	// Clean up price data so that all prices are rounded to 2 decimal places - its a problem with some of the price data that gets missed on import
	products = products.map((product) => {
		return {
			...product,
			price: parseFloat(product.price.toFixed(2)),
		}
	})

	extensions = extensions.map((extension) => {
		return {
			...extension,
			price: parseFloat(extension.price.toFixed(2)),
		}
	})
	const sortedProducts = products.sort((a, b) => {
		if (a.product_family !== b.product_family) {
			return a.product_family.localeCompare(b.product_family)
		}
		if (a.years !== b.years) {
			return a.years - b.years
		}
		return a.units_from - b.units_from
	})

	const extensionsWithKey = extensions.map((extension) => {
		return {
			...extension,
			key: extension.name.replace(/\s+/g, ''),
		}
	})

	const sortedExtensions = extensionsWithKey.sort((a, b) => {
		if (a.product_family !== b.product_family) {
			return a.product_family.localeCompare(b.product_family)
		}
		if (a.years !== b.years) {
			return a.years - b.years
		}
		if (a.name !== b.name) {
			return a.name.localeCompare(b.name)
		}
	})

	const uniqueExtensions = sortedExtensions.reduce((acc, extension) => {
		if (!acc[extension.key]) {
			acc[extension.key] = {
				key: extension.key,
				name: extension.name,
			}
		}
		return acc
	}, {})

	const uniqueExtensionsArray = Object.values(uniqueExtensions)

	const productData = {
		name: data.name,
		familyName: data.familyName,
		pricingType: data.pricingType,
		products: sortedProducts,
		extensions: sortedExtensions,
		availableExtensions: uniqueExtensionsArray,
	}

	if (productData.products.length === 0) {
		productData.minUnits = 0
		productData.maxUnits = 0
		productData.minUnitsStep = 0
		productData.minYears = 0
		productData.maxYears = 0
	} else {
		const minUnitsFrom = Math.min(...productData.products.map((product) => product.units_from))
		let maxUnitsTo

		if (
			productData.products.some(
				(product) => product.units_to === null || product.units_to === undefined || product.units_to === ''
			)
		) {
			maxUnitsTo = process.env.NEXT_PUBLIC_DEFAULT_MAX_UNITS
		} else {
			maxUnitsTo = Math.max(...productData.products.map((product) => product.units_to))
		}

		const minYears = Math.min(...productData.products.map((product) => product.years))
		const maxYears = Math.max(...productData.products.map((product) => product.years))

		productData.minUnits = minUnitsFrom >= 1 ? minUnitsFrom : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MIN_UNITS, 10)
		productData.maxUnits = maxUnitsTo >= 1 ? maxUnitsTo : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_UNITS, 10)
		productData.minUnitsStep = data?.minUnitsStep || productData.minUnits
		productData.minYears = minYears
		productData.maxYears = maxYears
	}

	return productData
}

/**
 * Fetches products and extensions for a given productFamily, and if productFamily uses them, a productOption, and returns the pre-processed results.
 *
 * @async
 * @function asyncFetchAndProcessProducts
 * Fetches and processes products and extensions for a given product family.
 * @param {string} productFamily - The product family for which to fetch and process product data.
 * @param {string?} productOption -The product option value within a product family for which to fetch and process product data. Optional since not all productFamilies have it, but required for those that do.
 * @returns {Promise<Object>} A promise that resolves to an object with the following properties:
 * 	 @property {string} name - The name of this product, specific to the particular option if there is one
 * 	 @property {string} familyName - The general name of the product that covers all options
 * 	 @property {PricingType} pricingType - The type of pricing used for this product (ie does it have units)
 *   @property {Array} products - The individual product SKUs sorted by years (low to high) and then by user tier (low to high).
 *   @property {Array} extensions - The individual extension SKUs sorted by years (low to high) and then by name.
 *   @property {Array} availableExtensions - An array of unique extensions with a key generated from the extension name (spaces removed).
 *   @property {number} minUnits - The minimum number of units (eg users) supported by the products.
 *   @property {number} maxUnits - The maximum number of units (eg users) supported by the products.
 * 	 @property {number} minUnitsStep - The minimum number of units by which a subscription may be changed - ie 10 if you have to increase by 10s (would mean any value not ending in 0 is invalid)
 *   @property {number} minYears - The minimum number of years a subscription is available for.
 *   @property {number} maxYears - The maximum number of years a subscription is available for.
 *
 * @example
 * const productFamily = 'CONNECT';
 * const processedProducts = await asyncFetchAndProcessProducts(productFamily);
 * console.log(processedProducts);
 */
const asyncFetchAndProcessProducts = async (productFamily, productOption = null) => {
	try {
		// Fetch from db
		// console.time('asyncFetchAndProcessProducts await 1')
		const [products, extensions, hardware] = await Promise.all([
			fetchFromProductDataCollection('products', productFamily, productOption),
			fetchFromProductDataCollection('extensions', productFamily, productOption),
			fetchFromProductDataCollection('hardware', productFamily, productOption),
		])
		// console.timeEnd('asyncFetchAndProcessProducts await 1')

		// Create a hardcoded data object hcData, which takes data from the getHardcodedProductData function.
		// It will return all fields in the object at the productFamily property, unless they are overridden by those at that object's `options` object's productOption property
		const allHardcoded = getHardcodedProductData()
		const hcFamily = allHardcoded?.[productFamily] || {}
		const hcOption = productOption ? hcFamily?.options?.[productOption] : {}
		const { options, ...hcFamilyExceptOptions } = hcFamily
		const hcData = { ...hcFamilyExceptOptions, ...hcOption } // the hardcoded values for this productData and productOption combo

		//TODO NEXT the min units step property

		return processProducts(hcData, products, extensions)
	} catch (error) {
		console.error('There was an error fetching or processing the products:', error)
		throw error
	}
}

export default asyncFetchAndProcessProducts
