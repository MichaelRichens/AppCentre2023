/**
 * ConfigurationSummary class definition.
 *
 * @module
 * This module ...
 */

const createProductDescription = Symbol('privateMethod')
const createExtensionsDescription = Symbol('privateMethod')
const createPrice = Symbol('privateMethod')
const durationString = Symbol('durationString')

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
    this.extensions = this[createExtensionsDescription](extensionNames)
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
      case 'sub':
        str += `Renewing ${productName} with ${existingUsers + userChange} ${
          unitName.pluralLC
        }`
        str += ` for ${this[durationString](years)}.`
        break
      case 'new':
        str += `Purchasing ${productName} with ${userChange} ${unitName.pluralLC}`
        str += ` for ${this[durationString](years)}.`
        break
      case 'add':
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
    }
    return str
  }

  [createExtensionsDescription](extensionNames) {
    if (!extensionNames || extensionNames.length == 0) {
      return ''
    }
    let str = 'With the '
    str +=
      extensionNames.length > 1
        ? extensionNames.slice(0, -1).join(', ') +
          ', and ' +
          extensionNames.slice(-1)
        : extensionNames[0]
    str += ' extension'
    str += extensionNames.length > 1 ? 's' : '' + '.'
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
