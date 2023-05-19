/**
 * ProductConfiguration class definition.
 *
 * @module
 * This module provides a ProductConfiguration class that represents an actual or potential purchase.
 * It relates to a new purchase of, or modification of an existing, product (eg Kerio Connect)
 * This is a simple record object with no validation.
 */

class ProductConfiguration {
	/**
	 * @param {string} type - The type of the configuration - 'new', 'sub' ect.
	 * @param {number} units - The number of units (eg users).
	 * @param {number} years - The number of years the subscription will last with this configuration, may be fractional, which is allowed for some type values.
	 * @param {number} [price=0] - The price of the selected product configuration.
	 * @param {Object} [skus={}] - An object containing the SKUs for the product as keys, and quantities as values.
	 * @param {ConfigurationSummary|null} [summary=null] - The summary of the product, object that contains text information intended for user display.  May be null if it isn't generated yet.
	 */
	constructor(type, units, years, price = 0, skus = {}, summary = null) {
		this.unType = type
		this.units = units
		this.years = years
		this.price = price
		this.skus = skus
		this.summary = summary
	}
}

export default ProductConfiguration
