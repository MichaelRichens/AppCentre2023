import { connectToDatabase } from './mongodb'

async function fetchExtensions(productFamily) {
  try {
    const client = await connectToDatabase()
    const db = client.db(process.env.DB_NAME)
    const productsCollection = db.collection('extensions')
    const query = productFamily ? { product_family: productFamily } : {}
    const extensions = await productsCollection.find(query).toArray()

    // Convert _id to string
    const ext = extensions.map((ext) => {
      return { ...ext, _id: ext._id.toString() }
    })
    return ext
  } catch (error) {
    console.error('Error fetching extensions:', error)
    throw new Error('Failed to fetch extensions from database')
  }
}

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
 * @returns {Object} The processed products object, which has the individual product skus sorted by years, low to high, and then by user tier low to high. And boundary data needed for the product configurator.
 */
const processProducts = (products, extensions) => {
  // We are working on the assumption that the data that comes from the database is valid - if there are things like a missing range of users for which a product that doesn't exist, or an extension that doesn't have skus that match all the years that there are product skus for, these cases have not been accounted for and results will mess up in interesting ways
  //This sorting is important, it being done is relied on elsewhere
  const sortedProducts = products.sort((a, b) => {
    if (a.product_family !== b.product_family) {
      return a.product_family.localeCompare(b.product_family)
    }
    if (a.years !== b.years) {
      return a.years - b.years
    }
    return a.units_from - b.units_from
  })

  const extensionsWithKey = extensions.map((extension) => {
    return {
      ...extension,
      key: extension.name.replace(/\s+/g, ''),
    }
  })

  const sortedExtensions = extensionsWithKey.sort((a, b) => {
    if (a.product_family !== b.product_family) {
      return a.product_family.localeCompare(b.product_family)
    }
    if (a.years !== b.years) {
      return a.years - b.years
    }
    if (a.name !== b.name) {
      return a.name.localeCompare(b.name)
    }
  })

  const uniqueExtensions = sortedExtensions.reduce((acc, extension) => {
    if (!acc[extension.key]) {
      acc[extension.key] = {
        key: extension.key,
        name: extension.name,
      }
    }
    return acc
  }, {})

  const uniqueExtensionsArray = Object.values(uniqueExtensions)

  console.log(uniqueExtensionsArray)

  const productData = {
    products: sortedProducts,
    extensions: sortedExtensions,
    availableExtensions: uniqueExtensionsArray,
  }

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

const fetchAndProcessProducts = async (productFamily) => {
  const [products, extensions] = await Promise.all([
    fetchProducts(productFamily),
    fetchExtensions(productFamily),
  ])
  return processProducts(products, extensions)
}

export default fetchAndProcessProducts
