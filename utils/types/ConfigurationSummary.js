import PurchaseType from './enums/PurchaseType'
import Word from './Word'
import formatPrice from '../formatPrice'

const createProductDescription = Symbol('privateMethod')
const createExtensionsDescription = Symbol('privateMethod')
const durationString = Symbol('durationString')

/**
 * ConfigurationSummary class definition.
 *
 * @module
 * This module takes in various attributes of a product configuration, and generates some text summaries suitable for display to the user.
 * It is immutable.
 * It can also be called with no or null arguments, to get an empty, unfrozen object.  This shouldn't be done, and is available for the fromProperties static method.
 *
 * @param {string} productName - The name of the product/product family, eg 'Kerio Connect'.
 * @param {PurchaseType} type - The type of purchase being made, new subscription, additional users, etc.
 * @param {number} price - The total price in GBP.
 * @param {number} existingUsers - The existing unit on a subscription which is being modified.
 * @param {number} userChange - The change in units being made to the subscription (or total users for a new subscription).
 * @param {number} years - The duration in years that the subscription will run for (or is running for if that is not being modified).  Can be fractional for some `type` values.
 * @param {string[]} extensionNames - The names (as in user-appropriate descriptions) of the extensions on this configuration, may be existing or new depending on `type`
 * @param {Word} unitName - A Word type object holding the name for the unit that the subscription is measured in - eg 'User'
 * @static fromProperties(properties: Object) - Creates a new ConfigurationSummary instance from an object with property values that match the properties of the ConfigurationSummary class.
 */
class ConfigurationSummary {
	constructor(
		productName = null,
		type = null,
		price = null,
		existingUsers = null,
		userChange = null,
		years = null,
		extensionNames = null,
		unitName = null
	) {
		// Return empty, unfrozen, object - required by the fromProperties static method
		if (
			productName === null ||
			type === null ||
			price === null ||
			existingUsers === null ||
			userChange === null ||
			years === null ||
			extensionNames === null ||
			unitName === null
		) {
			return
		}
		this.product = this[createProductDescription](productName, type, existingUsers, userChange, years, unitName)
		this.extensions = this[createExtensionsDescription](type, extensionNames)
		this.price = formatPrice(price)

		// Make the object immutable
		Object.freeze(this)
	}

	/**
	 * Creates a new ConfigurationSummary instance from a plain object with the generated properties.
	 * @param {Object} obj - The plain object containing the generated properties needed to create a ConfigurationSummary instance.
	 * @returns {ConfigurationSummary} A new ConfigurationSummary instance.
	 */
	static fromProperties(obj) {
		const instance = new ConfigurationSummary()
		Object.assign(instance, obj)
		Object.freeze(instance)
		return instance
	}

	[createProductDescription](productName, type, existingUsers, userChange, years, unitName) {
		let str = ''
		switch (type) {
			case PurchaseType.SUB:
				str += `Subscription Renewal: ${productName} with ${existingUsers + userChange} ${unitName.pluralLC}`
				str += ` for ${this[durationString](years)}.`
				break
			case PurchaseType.NEW:
				str += `New Purchase: ${productName} with ${userChange} ${unitName.pluralLC}`
				str += ` for ${this[durationString](years)}.`
				break
			case PurchaseType.ADD:
				str += `Additional Users: ${userChange} additional ${productName} ${unitName.pluralLC}`
				str += ` for the remaining ${this[durationString](years)} on the subscription`
				str +=
					process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_USERS === 'true'
						? `, bringing the total to ${existingUsers + userChange} ${unitName.pluralLC}.`
						: '.'
				break
			case PurchaseType.EXT:
				str += `Existing ${productName} subscription of ${existingUsers} ${unitName.pluralLC} with ${this[
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

export default ConfigurationSummary
