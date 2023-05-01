/**
 * Calculates the price and generates the skus needed for a given set of configurator options, based on the skus passed in.
 *
 * @param {Array} products- The individual product skus data to calculate price from, these must be already sorted from low to high user tiers.
 * @param {Object} configuratorOptions - The configurator options, such as type, users, and years.
 * @returns {Object} An object with the calculated price in the `price` field, and a `skus` field that contains an object that has a field for each sku with the value being the quantity of that sku.
 */
function generateSkusAndCalculatePrice(products, configuratorOptions) {
  const options = { ...configuratorOptions }

  let price = 0
  const skus = {}

  const productsWithCorrectYear = products.filter(
    (sku) => sku.years == configuratorOptions.years
  )

  console.log(options)
  productsWithCorrectYear.forEach((product) => {
    // Your code here
  })

  return { price: price, skus: skus }
}

export default generateSkusAndCalculatePrice
