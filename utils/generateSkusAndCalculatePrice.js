/**
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 *
 * @param {Array} products- The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param {Object} configuratorOptions - The configurator options, such as type, users, and years.
 * @returns {Object} An object with the calculated price in the `price` field, and a `skus` field that contains an object that has a field for each sku with the value being the quantity of that sku.
 */
function generateSkusAndCalculatePrice(products, configuratorOptions) {
  const numUsers = configuratorOptions.users
  let price = 0
  const skus = {}

  const productsWithCorrectYear = products.filter(
    (sku) => sku.years == configuratorOptions.years
  )

  console.log(configuratorOptions)
  // We are relying on products (and therefore productsWithCorrectYear) being passed in already sorted by low to high user tiers.
  for (let i = productsWithCorrectYear.length - 1; i >= 0; i--) {
    const product = productsWithCorrectYear[i]
    console.log(product)
    console.log(product.units_from)
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

    if (unitsFrom <= numUsers && numUsers <= unitsTo) {
      console.log(
        `${unitsFrom} <= ${numUsers} <= ${unitsTo} with price: ${product.price}`
      )
      skus[product.sku] = numUsers
      price += product.price * numUsers
      break
    }
  }

  return {
    price: price,
    skus: skus,
    type: configuratorOptions.type,
    years: configuratorOptions.years,
  }
}

export default generateSkusAndCalculatePrice
