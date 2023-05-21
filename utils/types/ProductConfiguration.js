import { ProductConfigurationUnit } from './ConfigurationSummary'
import PricingType from './enums/PricingType'
import PurchaseType from './enums/PurchaseType'

/**
 * ProductConfiguration class definition.
 *
 * @class
 * This is the ProductConfiguration class that represents an actual or potential purchase.
 * It relates to a new purchase of, or modification of an existing, product (eg Kerio Connect)
 */

export class ProductConfiguration {
	/**
	 * @param {PricingType} pricingType - The PricingType (.UNIT, .HARDSUB, etc) that this instance holds.
	 * @param {PurchaseType} unType - The type of the configuration - 'new', 'sub' ect.
	 * @param {number} [price=0] - The price of the selected product configuration.
	 * @param {Object} [skus={}] - An object containing the SKUs for the product as keys, and quantities as values.
	 * @param {ConfigurationSummaryUnit|null} [summary=null] - The summary of the product, object that contains text information intended for user display.  Its class depends on the pricingType.  May be null if it isn't generated yet.
	 */
	constructor(pricingType, unType, price = 0, skus = {}, summary = null) {
		this.pricingType = pricingType
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

	get description() {
		if (this.summary === null) {
			throw new Error('description getter called on instance with null summary')
		}
		switch (this.pricingType) {
			case PricingType.UNIT:
				return `${this.summary.product}${this.summary.extensions ? ' ' + this.summary.extensions : ''}`
			default:
				throw new Error(`Unknown pricingType: ${this.pricingType}`)
		}
	}
}

export default ProductConfiguration
