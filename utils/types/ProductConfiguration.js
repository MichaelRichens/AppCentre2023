import PricingType from './enums/PricingType'
import PurchaseType from './enums/PurchaseType'

/**
 * ProductConfigurationUnit class definition.
 *
 * @class
 * This is the ProductConfigurationUnit class that represents an actual or potential purchase of a PricingType.UNIT configuration.
 * It relates to a new purchase of, or modification of an existing, product (eg Kerio Connect)
 * This is a simple record object with no validation.
 */

export class ProductConfigurationUnit {
	/**
	 * @param {PurchaseType} unType - The type of the configuration - 'new', 'sub' ect.
	 * @param {number} [price=0] - The price of the selected product configuration.
	 * @param {Object} [skus={}] - An object containing the SKUs for the product as keys, and quantities as values.
	 * @param {ConfigurationSummaryUnit|null} [summary=null] - The summary of the product, object that contains text information intended for user display.  May be null if it isn't generated yet.
	 */
	constructor(unType, price = 0, skus = {}, summary = null) {
		this.pricingType = PricingType.UNIT
		this.unType = unType
		this._price = parseFloat(price.toFixed(2)) // Store the price in a private variable
		this.skus = skus
		this.summary = summary
	}

	get price() {
		return this._price
	}

	set price(value) {
		this._price = parseFloat(value.toFixed(2)) // Round to 2 decimal places when setting the price
	}
}

export class ProductConfigurationHardSub {}
