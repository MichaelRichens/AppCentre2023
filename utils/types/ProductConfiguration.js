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
	 * @param {PurchaseType} type - The type of the configuration - 'new', 'sub' ect.
	 * @param {number} [price=0] - The price of the selected product configuration.
	 * @param {Object} [skus={}] - An object containing the SKUs for the product as keys, and quantities as values.
	 * @param {ConfigurationSummaryUnit|null} [summary=null] - The summary of the product, object that contains text information intended for user display.  Its class depends on the pricingType.  May be null if it isn't generated yet.
	 * @param {boolean} [isShipping=false] - A flag that can be set to true if something on this order requires being shipped.
	 * @param {string} [licence=''] - Optional. The licence code of a subscription being modified.  At time of writing only ever present on instances pulled from the database and created via fromRawProperties (since licence gets added directly to the database from the cart, this object is unused once the cart has been populated).
	 * @static fromRawProperties - Creates a new instance from the properties of the passed object, assumed to be a raw serialisation of another instance (ie will use backing field names not getter names)
	 */
	constructor(pricingType, type, price = 0, skus = {}, summary = null, isShipping = false, licence = '') {
		this.pricingType = pricingType
		this.type = type
		this._price = parseFloat(price.toFixed(2)) // Store the price in a private variable
		this.skus = skus
		this.summary = summary
		this.isShipping = isShipping
		this.licence = licence
	}

	static fromRawProperties(properties) {
		const { pricingType, type, _price, skus, summary, isShipping, licence } = properties

		return new ProductConfiguration(pricingType, type, _price, skus, summary, isShipping, licence)
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
				return `${this.licence.length > 0 ? this.licence + ' :' : ''}${this.summary.product}${
					this.summary.extensions ? ' ' + this.summary.extensions : ''
				}`
			default:
				return (this.licence.length > 0 ? this.licence + ' :' : '') + this.summary.product
		}
	}
}

export default ProductConfiguration
