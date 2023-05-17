import ProductConfiguration from './types/ProductConfiguration'
import ConfigurationSummary from './types/ConfigurationSummary'
import PurchaseType from './types/enums/PurchaseType'
/**
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 *
 * @param {string} ProductName - The text name of the product.
 * @param {Object[]} products - The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param {Object[]} extensions - The individual extensions skus data to calculate price from.
 * @param {Object} configuratorOptions - The configurator options, such as type, users, and years.
 * @param {Word} unitName - The type of units that are being used (users or whatever)
 * @param {Number|null} minUnitsOverride - Can be passed to override the lowe bound on user tier requirements - as long as the configured users is at least this many, use the lowest tier, even if it says it needs more.
 * @returns {ProductConfiguration} Has the number of users being purchased, the calculated price in the `price` field, and a `skus` field is a dictionary object sku => qty.  Also has the type and years from the configuratorOptions parameter
 */
function processConfiguration(
	productName,
	products,
	extensions,
	configuratorOptions,
	unitName,
	minUnitsOverride = null
) {
	/** The return object */
	const result = new ProductConfiguration(configuratorOptions.type, 0, configuratorOptions.years)

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

	switch (configuratorOptions.type) {
		case PurchaseType.NEW:
			numUnitsForPriceBand = configuratorOptions.unitsChange
			numUnitsToPurchase = configuratorOptions.unitsChange
			wholeYears = Math.ceil(configuratorOptions.years)
			break
		case PurchaseType.ADD:
			if (process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true') {
				numUnitsForPriceBand = configuratorOptions.unitsChange + configuratorOptions.existingUnits
			} else {
				numUnitsForPriceBand = configuratorOptions.unitsChange
			}
			numUnitsToPurchase = configuratorOptions.unitsChange
			wholeYears = Math.floor(configuratorOptions.years)
			partYears = configuratorOptions.years - wholeYears
			break
		case PurchaseType.EXT:
			numUnitsToPurchase = configuratorOptions.existingUnits
			numUnitsForPriceBand = 0
			wholeYears = Math.floor(configuratorOptions.years)
			partYears = configuratorOptions.years - wholeYears
			break
		default:
			numUnitsForPriceBand = configuratorOptions.unitsChange + configuratorOptions.existingUnits
			numUnitsToPurchase = configuratorOptions.unitsChange + configuratorOptions.existingUnits
			wholeYears = Math.ceil(configuratorOptions.years)
	}

	if (numUnitsToPurchase < 1) {
		// No users, just exit early with default result.
		return result
	}

	result.units = numUnitsToPurchase

	if (configuratorOptions.type !== PurchaseType.EXT) {
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
		const wholeYearExtensions = findExtensions(configuratorOptions.checkedExtensions, extensions, wholeYears)

		wholeYearExtensions.forEach((extension) => {
			result.skus[extension.sku] = numUnitsToPurchase
			result.price += extension.price * numUnitsToPurchase
		})
		extensionNames = wholeYearExtensions.map((extension) => extension.name)
	}
	if (partYears > 0) {
		const partYearExtensions = findExtensions(configuratorOptions.checkedExtensions, extensions, 1)

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
		configuratorOptions.existingUnits,
		configuratorOptions.unitsChange,
		wholeYears + partYears,
		extensionNames,
		unitName
	)

	return result
}

/**
 * Helper function.
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
 * Helper function.
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

export default processConfiguration
