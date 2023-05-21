import PurchaseType from './enums/PurchaseType'
import { formatPriceFromPounds } from '../formatPrice'

const createProductDescription = Symbol('privateMethod')
const createExtensionsDescription = Symbol('privateMethod')
const durationString = Symbol('durationString')

/**
 * ConfigurationSummaryUnit class definition.
 *
 * @class
 * This module takes in various attributes of a product configuration for PricingType.Unit, and generates some text summaries suitable for display to the user.
 * It is immutable.
 * @warning It can also be called with no or null arguments, to get an empty, unfrozen object.  This shouldn't be done, and is available for the fromProperties static method.
 * @param {string} productName - The name of the product/product family, eg 'Kerio Connect'.
 * @param {PurchaseType} type - The type of purchase being made, new subscription, additional users, etc.
 * @param {number} price - The total price in GBP (or rather process.env.NEXT_PUBLIC_CURRENCY_UC / process.env.NEXT_PUBLIC_CURRENCY_LC).
 * @param {number} unitsExisting - The existing unit on a subscription which is being modified.
 * @param {number} unitsChange - The change in units being made to the subscription (or total users for a new subscription).
 * @param {number} years - The duration in years that the subscription will run for (or is running for if that is not being modified).  Can be fractional for some `type` values.
 * @param {string[]} extensionNames - The names (as in user-appropriate descriptions) of the extensions on this configuration, may be existing or new depending on `type`
 * @param {Object} unitName - A createUnitName object holding the name for the unit that the subscription is measured in - eg 'User'
 * @static fromProperties(properties: Object) - Creates a new ConfigurationSummaryUnit instance from an object with property values that match the properties of the ConfigurationSummaryUnit class.
 */
export class ConfigurationSummaryUnit {
	constructor(
		productName = null,
		type = null,
		price = null,
		unitsExisting = null,
		unitsChange = null,
		years = null,
		extensionNames = null,
		unitName = null
	) {
		// Return empty, unfrozen, object - required by the fromProperties static method
		if (
			productName === null ||
			type === null ||
			price === null ||
			unitsExisting === null ||
			unitsChange === null ||
			years === null ||
			extensionNames === null ||
			unitName === null
		) {
			return
		}
		this.product = this[createProductDescription](productName, type, unitsExisting, unitsChange, years, unitName)
		this.extensions = this[createExtensionsDescription](type, extensionNames)
		this.price = formatPriceFromPounds(price)

		// Make the object immutable
		Object.freeze(this)
	}

	/**
	 * Creates a new ConfigurationSummaryUnit instance from a plain object with the generated properties.
	 * @param {Object} obj - The plain object containing the generated properties needed to create a ConfigurationSummaryUnit instance.
	 * @returns {ConfigurationSummaryUnit} A new ConfigurationSummaryUnit instance.
	 */
	static fromProperties(obj) {
		const instance = new ConfigurationSummaryUnit()
		Object.assign(instance, obj)
		Object.freeze(instance)
		return instance
	}

	[createProductDescription](productName, type, unitsExisting, unitsChange, years, unitName) {
		let str = ''
		switch (type) {
			case PurchaseType.SUB:
				str += `Subscription Renewal: ${productName} with ${unitsExisting + unitsChange} ${unitName.pluralLC}`
				if (unitsChange > 0) {
					str += ` (increased from ${unitsExisting})`
				}
				str += ` for ${this[durationString](years)}.`
				break
			case PurchaseType.NEW:
				str += `New Purchase: ${productName} with ${unitsChange} ${unitName.pluralLC}`
				str += ` for ${this[durationString](years)}.`
				break
			case PurchaseType.ADD:
				str += `Additional Users: ${unitsChange} additional ${productName} ${unitName.pluralLC}`
				str += ` for the less than ${this[durationString](years)} remaining on the subscription`
				str +=
					process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_UNITS === 'true'
						? `, bringing the total to ${unitsExisting + unitsChange} ${unitName.pluralLC}.`
						: '.'
				break
			case PurchaseType.EXT:
				str += `Existing ${productName} subscription of ${unitsExisting} ${unitName.pluralLC} with up to ${this[
					durationString
				](years)} remaining.`
				break
		}
		return str
	}

	[createExtensionsDescription](type, extensionNames) {
		if (!extensionNames || extensionNames.length == 0) {
			return ''
		}
		let str = `${type === PurchaseType.EXT ? 'Add' : 'With'} the `
		str +=
			extensionNames.length > 1
				? extensionNames.slice(0, -1).join(', ') + ', and ' + extensionNames.slice(-1)
				: extensionNames[0]
		str += ' extension'
		str += extensionNames.length > 1 ? 's' : ''
		str += '.'
		return str
	}

	[durationString](years) {
		if (years <= 0) {
			return ''
		}
		const wholeYears = Math.floor(years)
		const partYears = years - wholeYears
		let str = ''
		if (wholeYears > 0) {
			str += `${wholeYears} year${wholeYears != 1 ? 's' : ''}`
			if (partYears > 0) {
				str += ' and '
			}
		}
		if (partYears > 0) {
			str += `${Math.floor(partYears * 12)} months`
		}
		return str
	}
}
