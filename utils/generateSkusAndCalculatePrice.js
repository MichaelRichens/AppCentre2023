/**
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 *
 * @param {Array} products - The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param {Array} extensions - The individual extensions skus data to calculate price from.
 * @param {Object} configuratorOptions - The configurator options, such as type, users, and years.
 * @returns {Object} An object with the calculated price in the `price` field, and a `skus` field that contains an object that has a field for each sku with the value being the quantity of that sku.
 */
function generateSkusAndCalculatePrice(
  products,
  extensions,
  configuratorOptions
) {
  /**
   * @var Number - Represents the total number of users on the subscription, including existing users and any being added.
   * This value is used for determining the price band based on the subscription type.
   */
  const numUsersForPriceBand =
    configuratorOptions.userChange + configuratorOptions.existingUsers
  /**
   * @var Number - Represents the total number of users being added to the description.
   * This value is used for determining the quantity to purchase.
   */
  let numUsersToPurchase = configuratorOptions.userChange
  if (configuratorOptions.type != 'add') {
    numUsersToPurchase += configuratorOptions.existingUsers
  }
  let price = 0
  const skus = {}

  const productsWithCorrectYear = products.filter(
    (sku) => sku.years == configuratorOptions.years
  )

  // We are relying on products (and therefore productsWithCorrectYear) being passed in already sorted by low to high user tiers.
  let foundProductSku = false
  for (let i = productsWithCorrectYear.length - 1; i >= 0; i--) {
    const product = productsWithCorrectYear[i]

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
      /*console.log(
        `${unitsFrom} <= ${numUsersForPriceBand} <= ${unitsTo} with price: ${product.price}`
      )*/
      skus[product.sku] = numUsersToPurchase
      price += product.price * numUsersToPurchase
      foundProductSku = true
      break
    }
  }

  if (!foundProductSku) {
    // This is probably bad data in the database, though could be a user screwing with the data being fed into the function.
    // Look for things like a bad figure in users_from, users_to or years - we don't exhaustively check for problems when importing this data
    throw new Error(
      'Unable to find correct product sku, unable to proceed.  This probably indicates an error in the database.'
    )
  }

  const filteredExtensions = extensions.filter((extension) => {
    return (
      extension.years === configuratorOptions.years &&
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
    // Look for things like a bad figure in years - we don't exhaustively check for problems when importing this data
    throw new Error(
      'Extension mismatch, unable to proceed.  This probably indicates an error in the database.'
    )
  }

  uniqueExtensions.forEach((extension) => {
    skus[extension.sku] = numUsersToPurchase
    price += extension.price * numUsersToPurchase
  })

  return {
    price: price,
    skus: skus,
    type: configuratorOptions.type,
    years: configuratorOptions.years,
  }
}

export default generateSkusAndCalculatePrice
