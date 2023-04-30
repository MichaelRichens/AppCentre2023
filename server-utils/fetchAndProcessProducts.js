import { connectToDatabase } from './mongodb'

async function fetchProducts(productFamily) {
  try {
    const client = await connectToDatabase()
    const db = client.db(process.env.DB_NAME)
    const productsCollection = db.collection('products')

    const query = productFamily ? { product_family: productFamily } : {}
    const products = await productsCollection.find(query).toArray()

    // Convert _id to string
    const productsWithIdAsString = products.map((product) => {
      return { ...product, _id: product._id.toString() }
    })
    return productsWithIdAsString
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products from database')
  }
}

/**
 * Processes all the skus for a gfi product for use by the rest of the application
 * @param {Array} products - The array of product skus to process.
 * @returns {Object} The processed products object, which has the individual product skus sorted into a useful order, and boundary data needed for the product configurator.
 */
const processProducts = (products) => {
  const sortedProducts = products.sort((a, b) => {
    if (a.product_family !== b.product_family) {
      return a.product_family.localeCompare(b.product_family)
    }
    if (a.years !== b.years) {
      return a.years - b.years
    }
    return a.units_from - b.units_from
  })

  const productData = { products: sortedProducts }

  if (productData.products.length === 0) {
    productData.minUsers = 0
    productData.maxUsers = 0
    productData.minYears = 0
    productData.maxYears = 0
  } else {
    const minUsersFrom = Math.min(
      ...productData.products.map((product) => product.users_from)
    )
    const maxUsersTo = Math.max(
      ...productData.products.map((product) => product.users_to)
    )
    const minYears = Math.min(
      ...productData.products.map((product) => product.years)
    )
    const maxYears = Math.max(
      ...productData.products.map((product) => product.years)
    )

    productData.minUsers =
      minUsersFrom >= 1
        ? minUsersFrom
        : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MIN_USERS, 10)
    productData.maxUsers =
      maxUsersTo >= 1
        ? maxUsersTo
        : parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_USERS, 10)
    productData.minYears = minYears
    productData.maxYears = maxYears
  }

  return productData
}

const fetchAndProcessProducts = async () => {
  const products = await fetchProducts()
  return processProducts(products)
}

export default fetchAndProcessProducts
