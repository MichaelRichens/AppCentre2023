import ProductConfiguration from './types/ProductConfiguration'
import ConfigurationSummary from './types/ConfigurationSummary'
import PricingType from './types/enums/PricingType'
import PurchaseType from './types/enums/PurchaseType'

/**
 * @function
 * Helper function for processConfigurationSub.
 * Returns the correct extensions that match a passed array of extension keys and a value for the years property.
 * Will throw if it can't find everything, since the alternative is likely to be a wrong purchase (it also normally indicates a coding or db screw up we want to be aware of quickly).
 * @param {string[]} searchKeys - The extension keys that must all be found.
 * @param {Object[]} extensions - The collection of extensions to search in.
 * @param {number} years - The years value that the found extension keys need to have.
 * @returns {Object[]} - The passed in extensions that matched the passed keys and the passed years value
 * @throws {Error} If the function is unable to find all the extensions it is looking for with the data it has to search in, it will throw.
 */
function findExtensions(searchKeys, extensions, years) {
	const yearMatches = extensions.filter((extension) => {
		return extension.years === years && searchKeys.some((key) => key === extension.key)
	})

	// checking the keys are unique so that we can check the number of extensions we have found vs the number of elements we are looking for and have a bit of a panic if we fail
	const uniqueExtensions = Array.from(new Set(yearMatches.map((extension) => extension.key))).map((key) =>
		yearMatches.find((extension) => extension.key === key)
	)

	if (uniqueExtensions.length !== searchKeys.length) {
		// This is probably bad data in the database, though could be a user screwing with the data being fed into the function. If its a bad db entry, look for things like a bad figure in years - we don't really check for problems when importing this data
		const uKeys = uniqueExtensions.map((extension) => extension.key).join(', ')
		const sKeys = searchKeys.join(', ')
		const errorMessage = `Extension mismatch, unable to proceed. This probably indicates an error in the database. Looking for year duration: ${years}.\nUnique Extensions: ${uKeys} != Checked Extensions: ${sKeys}`
		throw new Error(errorMessage)
	}
	return uniqueExtensions
}

/**
 * Helper function for processConfigurationUnit.
 * Returns the sku of first product it encounters (searching from the end of the passed array) which has a user band that matches the passed number.
 * @param {object[]} sortedProductsOfCorrectYear - An array of products, where we want to find the one which is for the correct user band
 * @param {number} numUnitsForPriceBand - The number of users, from which to find the user band.
 * @param {Number|null} minUnitsOverride - Can be passed to override the lowe bound on user tier requirements - as long as the configured users is at least this many, use the lowest tier, even if it says it needs more. (Used when you can add a lower number of users than the min amount)
 * @returns {object|boolean} - The found product, or false if none was found.
 */
function findProductWithCorrectUserBand(sortedProductsOfCorrectYear, numUnitsForPriceBand, minUnitsOverride) {
	// We are relying on sortedProducts being passed in already sorted by low to high user tiers.

	let fallbackLowUserTier = null

	for (let i = sortedProductsOfCorrectYear.length - 1; i >= 0; i--) {
		const product = sortedProductsOfCorrectYear[i]
		if (
			minUnitsOverride !== null &&
			(fallbackLowUserTier === null || product.units_from < fallbackLowUserTier.units_from)
		) {
			fallbackLowUserTier = product
		}

		let unitsFrom
		if (Number.isInteger(product.units_from) && product.units_from > 0) {
			unitsFrom = product.units_from
		} else {
			unitsFrom = parseInt(process.env.NEXT_PUBLIC_DEFAULT_MIN_UNITS, 10)
		}

		let unitsTo
		if (Number.isInteger(product.units_to) && product.units_to > 0) {
			unitsTo = product.units_to
		} else {
			unitsTo = parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_UNITS, 10)
		}
		if (unitsFrom <= numUnitsForPriceBand && numUnitsForPriceBand <= unitsTo) {
			return product
		}

		if (fallbackLowUserTier !== null) {
			return fallbackLowUserTier
		}
	}
	return false
}

/**
 * @function
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 * Main logic function for processConfiguration - handles PricingType.SUB
 *
 * @param {string} ProductName - The text name of the product.
 * @param {Object[]} products - The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param {Object[]} extensions - The individual extensions skus data to calculate price from.
 * @param {Object} formData - The configurator options, such as type, users, and years.
 * @param {Object} unitName - The type of units that are being used (users or whatever)
 * @param {number|null} minUnitsOverride - Can be passed to override the lowe bound on user tier requirements - as long as the configured users is at least this many, use the lowest tier, even if it says it needs more.
 * @returns {ProductConfiguration} Has the number of users being purchased, the calculated price in the `price` field, and a `skus` field is a dictionary object sku => qty.  Also has the type and years from the configuratorOptions parameter
 */
function processConfigurationSub(productName, products, extensions, formData, unitName, minUnitsOverride = null) {
	/** The return object */
	const result = new ProductConfiguration(formData.type, 0, formData.years)

	/**
	 * @type {number} - Represents the total number of users on the subscription, including existing users and any being added.
	 * This value is used for determining the price band based on the subscription type.
	 */
	let numUnitsForPriceBand
	/**
	 * @type {number} - Represents the total number of users being added to the description.
	 * This value is used for determining the quantity to purchase.
	 */
	let numUnitsToPurchase
	/**
	 * @type {number} - The number of complete years to purchase for.
	 * If fractional years are not allowed for a type option, any part year will be rounded up to here (not that this should ever happen)
	 */
	let wholeYears
	/**
	 * @type {number} - The fractional part of a year that is allowed with some types (eg PurchaseType.ADD - adding new users).
	 * Price will be calculated pro-rata from the 1 year sku
	 */
	let partYears = 0

	switch (formData.type) {
		case PurchaseType.NEW:
			numUnitsForPriceBand = formData.unitsChange
			numUnitsToPurchase = formData.unitsChange
			wholeYears = Math.ceil(formData.years)
			break
		case PurchaseType.ADD:
			if (process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true') {
				numUnitsForPriceBand = formData.unitsChange + formData.existingUnits
			} else {
				numUnitsForPriceBand = formData.unitsChange
			}
			numUnitsToPurchase = formData.unitsChange
			wholeYears = Math.floor(formData.years)
			partYears = formData.years - wholeYears
			break
		case PurchaseType.EXT:
			numUnitsToPurchase = formData.existingUnits
			numUnitsForPriceBand = 0
			wholeYears = Math.floor(formData.years)
			partYears = formData.years - wholeYears
			break
		default:
			numUnitsForPriceBand = formData.unitsChange + formData.existingUnits
			numUnitsToPurchase = formData.unitsChange + formData.existingUnits
			wholeYears = Math.ceil(formData.years)
	}

	if (numUnitsToPurchase < 1) {
		// No users, just exit early with default result.
		return result
	}

	result.units = numUnitsToPurchase

	if (formData.type !== PurchaseType.EXT) {
		const productsWithCorrectWholeYear = products.filter((sku) => sku.years === wholeYears)
		/** @var Array - Holds part codes for products with a 1 year subscription, used for pro-rata of part year items */
		const productsWithOneYear = products.filter((sku) => sku.years === 1)

		if (wholeYears > 0) {
			const wholeYearProduct = findProductWithCorrectUserBand(
				productsWithCorrectWholeYear,
				numUnitsForPriceBand,
				minUnitsOverride
			)

			if (wholeYearProduct === false) {
				throw new Error('This should never happen.  Unable to find product with correct duration.')
			}

			result.skus[wholeYearProduct.sku] = numUnitsToPurchase
			result.price += wholeYearProduct.price * numUnitsToPurchase
		}
		if (partYears > 0) {
			const partYearProduct = findProductWithCorrectUserBand(
				productsWithOneYear,
				numUnitsForPriceBand,
				minUnitsOverride
			)
			if (partYearProduct === false) {
				throw new Error('This should never happen.  Missing 1 year part code for product.')
			}

			result.skus[partYearProduct.sku] = numUnitsToPurchase * partYears
			result.price += partYearProduct.price * numUnitsToPurchase * partYears
		}
	}
	/** @type {string[]|boolean} Needs to be populated with a list of extension names to generate the summary from. Or boolean false if there are none. */
	let extensionNames = false

	if (wholeYears > 0) {
		const wholeYearExtensions = findExtensions(formData.checkedExtensions, extensions, wholeYears)

		wholeYearExtensions.forEach((extension) => {
			result.skus[extension.sku] = numUnitsToPurchase
			result.price += extension.price * numUnitsToPurchase
		})
		extensionNames = wholeYearExtensions.map((extension) => extension.name)
	}
	if (partYears > 0) {
		const partYearExtensions = findExtensions(formData.checkedExtensions, extensions, 1)

		partYearExtensions.forEach((extension) => {
			if (!result.skus.hasOwnProperty(extension.sku)) {
				result.skus[extension.sku] = 0
			}
			result.skus[extension.sku] += numUnitsToPurchase * partYears
			result.price += extension.price * numUnitsToPurchase * partYears
		})
		if (extensionNames === false) {
			extensionNames = partYearExtensions.map((extension) => extension.name)
		}
	}
	result.summary = new ConfigurationSummary(
		productName,
		result.type,
		result.price,
		formData.existingUnits,
		formData.unitsChange,
		wholeYears + partYears,
		extensionNames,
		unitName
	)

	return result
}

/**
 * @function
 * STUB
 */
function processConfigurationHardSub(productName, hardware, formData, unitName) {
	const result = new ProductConfiguration(formData.type, 0, formData.years)

	return result
}

/**
 * @function
 * Calculates the price and generates the skus needed for a given set of configurator options, based on passed in productData and formData.
 *
 * @param {Object} productData - The product data object which contains pricing, skus etc. - its shape will depend on its pricing type property (which must be present and of type PricingType)
 * @param {Object} formData - The form data object, which contains the user's choices - shape will depend on productData.pricingType
 */
function processConfiguration(productData, formData) {
	console.log(productData)
	switch (productData.pricingType) {
		case PricingType.UNIT: {
			return processConfigurationSub(
				productData.name,
				productData.products,
				productData.extensions,
				formData,
				productData.unitName,
				formData.type === PurchaseType.ADD && productData.minUnitsStep < productData.minUnits
					? productData.minUnitsStep
					: null
			)
		}
		case PricingType.HARDSUB: {
			return processConfigurationHardSub(productData.name, productData.hardware, formData, productData.unitName)
		}
		default:
			throw new Error(`Unknown pricingType: ${productData.pricingType}`)
	}
}

export default processConfiguration
