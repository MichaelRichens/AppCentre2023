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
 * Processes a products array for use.  Currently sorts only it.
 * @param {Array} products - The array of products to process.
 * @returns {Object} The processed products object.
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

  return sortedProducts
}

const fetchAndProcessProducts = async () => {
  const products = await fetchProducts()
  return processProducts(products)
}

export default fetchAndProcessProducts
