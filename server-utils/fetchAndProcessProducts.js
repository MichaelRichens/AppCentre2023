import { connectToDatabase } from './mongodb'

async function fetchExtensions(productFamily) {
	try {
		// console.time('fetchExtensions await 1')
		const client = await connectToDatabase()
		// console.timeEnd('fetchExtensions await 1')
		const db = client.db(process.env.DB_NAME)
		const productsCollection = db.collection('extensions')
		const query = productFamily ? { product_family: productFamily } : {}
		const extensions = await productsCollection.find(query).toArray()

		// Convert _id to string
		const ext = extensions.map((ext) => {
			return { ...ext, _id: ext._id.toString() }
		})
		return ext
	} catch (error) {
		console.error('Error fetching extensions:', error)
		throw new Error('Failed to fetch extensions from database')
	}
}

async function fetchProducts(productFamily) {
	try {
		// console.time('fetchProducts await 1')
		const client = await connectToDatabase()
		// console.timeEnd('fetchProducts await 1')
		const db = client.db(process.env.DB_NAME)
		const productsCollection = db.collection('products')
		const query = productFamily ? { product_family: productFamily } : {}
		// console.time('fetchProducts await 2')
		const products = await productsCollection.find(query).toArray()
		// console.timeEnd('fetchProducts await 2')

		// Convert _id to string
		const productsWithIdAsString = products.map((product) => {
			return { ...product, _id: product._id.toString() }
		})
		return productsWithIdAsString
	} catch (error) {
		console.error('Error fetching products:', error)
		throw new Error('Failed to fetch products from database')
	}
}

/**
 * Processes all the skus for a gfi product and its extensions for use by the rest of the application
 * @function processProducts
 * @param {Array} products - The array of product SKUs to process.
 * @param {Array} extensions - The array of extension SKUs to process.
 * @returns {Object} The processed products object with the following properties:
 *   @property {Array} products - The individual product SKUs sorted by years (low to high) and then by user tier (low to high).
 *   @property {Array} extensions - The individual extension SKUs sorted by years (low to high) and then by name.
 *   @property {Array} availableExtensions - An array of unique extensions with a key generated from the extension name (spaces removed).
 *   @property {number} minUsers - The minimum number of users supported by the products.
 *   @property {number} maxUsers - The maximum number of users supported by the products.
 *   @property {number} minYears - The minimum number of years a subscription is available for.
 *   @property {number} maxYears - The maximum number of years a subscription is available for.
 */
const processProducts = (products, extensions) => {
	// We are working on the assumption that the data that comes from the database is valid - if there are things like a missing range of users for which a product that doesn't exist, or an extension that doesn't have skus that match all the years that there are product skus for, these cases have not been accounted for and results will mess up in interesting ways
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
		products: sortedProducts,
		extensions: sortedExtensions,
		availableExtensions: uniqueExtensionsArray,
	}

	if (productData.products.length === 0) {
		productData.minUsers = 0
		productData.maxUsers = 0
		productData.minYears = 0
		productData.maxYears = 0
	} else {
		const minUsersFrom = Math.min(...productData.products.map((product) => product.units_from))
		const maxUsersTo = Math.max(...productData.products.map((product) => product.units_to))

		const minYears = Math.min(...productData.products.map((product) => product.years))
		const maxYears = Math.max(...productData.products.map((product) => product.years))

		productData.minUsers = minUsersFrom >= 1 ? minUsersFrom : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MIN_UNITS, 10)
		productData.maxUsers = maxUsersTo >= 1 ? maxUsersTo : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_UNITS, 10)
		productData.minYears = minYears
		productData.maxYears = maxYears
	}
	return productData
}

/**
 * Fetches products and extensions for a given product family and returns the pre-processed results.
 *
 * @async
 * @function fetchAndProcessProducts
 * Fetches and processes products and extensions for a given product family.
 * @param {string} productFamily - The product family for which to fetch and process products and extensions.
 * @returns {Promise<Object>} A promise that resolves to an object with the following properties:
 *   @property {Array} products - The individual product SKUs sorted by years (low to high) and then by user tier (low to high).
 *   @property {Array} extensions - The individual extension SKUs sorted by years (low to high) and then by name.
 *   @property {Array} availableExtensions - An array of unique extensions with a key generated from the extension name (spaces removed).
 *   @property {number} minUsers - The minimum number of users supported by the products.
 *   @property {number} maxUsers - The maximum number of users supported by the products.
 *   @property {number} minYears - The minimum number of years a subscription is available for.
 *   @property {number} maxYears - The maximum number of years a subscription is available for.
 *
 * @example
 * const productFamily = 'CONNECT';
 * const processedProducts = await fetchAndProcessProducts(productFamily);
 * console.log(processedProducts);
 */
const asyncFetchAndProcessProducts = async (productFamily) => {
	// console.time('asyncFetchAndProcessProducts await 1')
	const [products, extensions] = await Promise.all([fetchProducts(productFamily), fetchExtensions(productFamily)])
	// console.timeEnd('asyncFetchAndProcessProducts await 1')
	return processProducts(products, extensions)
}

export default asyncFetchAndProcessProducts
