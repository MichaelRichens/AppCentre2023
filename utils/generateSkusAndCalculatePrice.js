/**
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 *
 * @param Array products - The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param Array extensions - The individual extensions skus data to calculate price from.
 * @param Object configuratorOptions - The configurator options, such as type, users, and years.
 * @returns Object An object with the calculated price in the `price` field, and a `skus` field that contains an object that has a field for each sku with the value being the quantity of that sku.
 */
function generateSkusAndCalculatePrice(
  products,
  extensions,
  configuratorOptions
) {
  console.log(configuratorOptions)
  let result = {
    price: 0,
    skus: {},
    type: configuratorOptions.type,
    years: configuratorOptions.years,
  }
  /**
   * @var Number - Represents the total number of users on the subscription, including existing users and any being added.
   * This value is used for determining the price band based on the subscription type.
   */
  let numUsersForPriceBand

  /**
   * @var Number - Represents the total number of users being added to the description.
   * This value is used for determining the quantity to purchase.
   */
  let numUsersToPurchase

  /**
   * @var Number - The number of complete years to purchase for.
   * If fractional years are not allowed for a type option, any part year will be rounded up to here (not that this should ever happen)
   */
  let wholeYears

  /**
   * @var Number - The fractional part of a year that is allowed with some types (eg 'add' - adding new users).
   * Price will be calculated pro-rata from the 1 year sku
   */
  let partYears = 0

  switch (configuratorOptions.type) {
    case 'new':
      numUsersForPriceBand = configuratorOptions.userChange
      numUsersToPurchase = configuratorOptions.userChange
      wholeYears = Math.ceil(configuratorOptions.years)
      break
    case 'add':
      if (
        process.env.NEXT_PUBLIC_ADD_UNIT_PRICE_BAND_CONSIDERS_ALL_USERS ===
        'true'
      ) {
        numUsersForPriceBand =
          configuratorOptions.userChange + configuratorOptions.existingUsers
      } else {
        numUsersForPriceBand = configuratorOptions.userChange
      }
      numUsersToPurchase = configuratorOptions.userChange
      wholeYears = Math.floor(configuratorOptions.years)
      partYears = configuratorOptions.years - wholeYears
      break
    default:
      numUsersForPriceBand =
        configuratorOptions.userChange + configuratorOptions.existingUsers
      numUsersToPurchase =
        configuratorOptions.userChange + configuratorOptions.existingUsers
      wholeYears = Math.ceil(configuratorOptions.years)
  }

  if (numUsersToPurchase < 1) {
    return result
  }

  const productsWithCorrectWholeYear = products.filter(
    (sku) => sku.years === wholeYears
  )
  /** @var Array - Holds part codes for products with a 1 year subscription, used for pro-rata of part year items */
  const productsWithOneYear = products.filter((sku) => sku.years === 1)

  if (wholeYears > 0) {
    const wholeYearProduct = findProductWithCorrectUserBand(
      productsWithCorrectWholeYear,
      numUsersForPriceBand
    )

    if (wholeYearProduct === false) {
      // If we haven't found it, it is probably a too high a unit number (above max limit).  Probably the user quantity is being edited, just return 0 price and no skus, and it will probably sort itself out when the user finishes editing the field.
      // And if not, this seems to be the way to do the least harm.
      // Alternative would be either to not live update as the unit field is being edited, but I like that feature.  Or to coerce the numbers as they are being edited, but that's a real usability pain.
      return result
    }

    result.skus[wholeYearProduct.sku] = numUsersToPurchase
    result.price += wholeYearProduct.price * numUsersToPurchase
  }
  if (partYears > 0) {
    const partYearProduct = findProductWithCorrectUserBand(
      productsWithOneYear,
      numUsersForPriceBand
    )
    if (partYearProduct === false) {
      if (wholeYears > 0) {
        throw new Error(
          'This really should never happen.  Missing 1 year part code for product?'
        )
      }
      // wholeYears == 0, so we haven't found any part codes for this product.  Exit early for reasons given in comment after partYearProduct search failure.
      return result
    }

    result.skus[partYearProduct.sku] = numUsersToPurchase * partYears
    result.price += partYearProduct.price * numUsersToPurchase * partYears
  }

  const filteredExtensions = extensions.filter((extension) => {
    return (
      extension.years === wholeYears &&
      configuratorOptions.checkedExtensions.some((key) => key === extension.key)
    )
  })

  // checking the keys are unique so that we can check the number of extensions we have found vs the number of elements we are looking for and have a bit of a panic if we fail
  const uniqueExtensions = Array.from(
    new Set(filteredExtensions.map((extension) => extension.key))
  ).map((key) => filteredExtensions.find((extension) => extension.key === key))

  if (
    uniqueExtensions.length !== configuratorOptions.checkedExtensions.length
  ) {
    // This is probably bad data in the database, though could be a user screwing with the data being fed into the function.
    // Have also had this pop up randomly during dev, and hoping it is due to stale code...
    // If its a bad db entry, look for things like a bad figure in years - we don't really check for problems when importing this data
    const uniqueExtensionsKeys = uniqueExtensions
      .map((extension) => extension.key)
      .join(', ')
    const checkedExtensionsKeys =
      configuratorOptions.checkedExtensions.join(', ')
    const errorMessage = `Extension mismatch, unable to proceed. This probably indicates an error in the database. Unique Extensions: ${uniqueExtensionsKeys} != Checked Extensions: ${checkedExtensionsKeys}`
    throw new Error(errorMessage)
  }

  uniqueExtensions.forEach((extension) => {
    result.skus[extension.sku] = numUsersToPurchase
    result.price += extension.price * numUsersToPurchase
  })

  return result
}

/**
 * Helper function.
 * Returns the sku of first product it encounters (searching from the end of the passed array) which has a user band that matches the passed number.
 * @param array sortedProductsOfCorrectYear - An array of products, where we want to find the one which is for the correct user band
 * @param number numUsersForPriceBand - The number of users, from which to find the user band.
 * @returns object|boolean - The found product, or false if none was found.
 */
function findProductWithCorrectUserBand(
  sortedProductsOfCorrectYear,
  numUsersForPriceBand
) {
  // We are relying on sortedProducts being passed in already sorted by low to high user tiers.
  for (let i = sortedProductsOfCorrectYear.length - 1; i >= 0; i--) {
    const product = sortedProductsOfCorrectYear[i]

    let unitsFrom
    if (Number.isInteger(product.units_from) && product.units_from > 0) {
      unitsFrom = product.units_from
    } else {
      unitsFrom = parseInt(process.env.NEXT_PUBLIC_DEFAULT_MIN_USERS, 10)
    }

    let unitsTo
    if (Number.isInteger(product.units_to) && product.units_to > 0) {
      unitsTo = product.units_to
    } else {
      unitsTo = parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_USERS, 10)
    }
    if (unitsFrom <= numUsersForPriceBand && numUsersForPriceBand <= unitsTo) {
      return product
    }
  }
  return false
}

export default generateSkusAndCalculatePrice
