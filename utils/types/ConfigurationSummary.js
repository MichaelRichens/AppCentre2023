import PurchaseType from './enums/PurchaseType'
import Word from './Word'

const createProductDescription = Symbol('privateMethod')
const createExtensionsDescription = Symbol('privateMethod')
const createPrice = Symbol('privateMethod')
const durationString = Symbol('durationString')

/**
 * ConfigurationSummary class definition.
 *
 * @module
 * This module takes in various attributes of a product configuration, and generates some text summaries suitable for display to the user.
 * It is immutable.
 *
 * @param {string} productName - The name of the product/product family, eg 'Kerio Connect'.
 * @param {PurchaseType} type - The type of purchase being made, new subscription, additional users, etc.
 * @param {number} price - The total price in GBP.
 * @param {number} existingUsers - The existing unit on a subscription which is being modified.
 * @param {number} userChange - The change in units being made to the subscription (or total users for a new subscription).
 * @param {number} years - The duration in years that the subscription will run for (or is running for if that is not being modified).  Can be fractional for some `type` values.
 * @param {string[]} extensionNames - The names (as in user-appropriate descriptions) of the extensions on this configuration, may be existing or new depending on `type`
 * @param {Word} unitName - A Word type object holding the name for the unit that the subscription is measured in - eg 'User'
 */
class ConfigurationSummary {
  constructor(
    productName,
    type,
    price,
    existingUsers,
    userChange,
    years,
    extensionNames,
    unitName
  ) {
    this.product = this[createProductDescription](
      productName,
      type,
      existingUsers,
      userChange,
      years,
      unitName
    )
    this.extensions = this[createExtensionsDescription](type, extensionNames)
    this.price = this[createPrice](price)

    // Make the object immutable
    Object.freeze(this)
  }

  [createProductDescription](
    productName,
    type,
    existingUsers,
    userChange,
    years,
    unitName
  ) {
    let str = ''
    switch (type) {
      case PurchaseType.SUB:
        str += `Renewing ${productName} with ${existingUsers + userChange} ${
          unitName.pluralLC
        }`
        str += ` for ${this[durationString](years)}.`
        break
      case PurchaseType.NEW:
        str += `Purchasing ${productName} with ${userChange} ${unitName.pluralLC}`
        str += ` for ${this[durationString](years)}.`
        break
      case PurchaseType.ADD:
        str += `Purchasing ${userChange} additional ${productName} ${unitName.pluralLC}`
        str += ` for the remaining ${this[durationString](
          years
        )} on your subscription`
        str +=
          process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_USERS ===
          'true'
            ? `, bringing the total to ${existingUsers + userChange} ${
                unitName.pluralLC
              }.`
            : '.'
        break
      case PurchaseType.EXT:
        str += `Existing ${productName} subscription of ${existingUsers} ${
          unitName.pluralLC
        } with ${this[durationString](years)} remaining.`
        break
    }
    return str
  }

  [createExtensionsDescription](type, extensionNames) {
    if (!extensionNames || extensionNames.length == 0) {
      return ''
    }
    let str = `${type === PurchaseType.EXT ? 'Adding' : 'With'} the `
    str +=
      extensionNames.length > 1
        ? extensionNames.slice(0, -1).join(', ') +
          ', and ' +
          extensionNames.slice(-1)
        : extensionNames[0]
    str += ' extension'
    str += extensionNames.length > 1 ? 's' : ''
    str += '.'
    return str
  }

  [createPrice](price) {
    const formattedPrice = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price)
    return `${formattedPrice} + vat`
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
