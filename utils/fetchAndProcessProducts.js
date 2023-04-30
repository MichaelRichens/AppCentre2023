async function fetchProducts() {
  try {
    const res = await fetch(`/opt/build/repo/.next/server/pages/api/products`)
    if (!res.ok) {
      throw new error(
        `Error fetching products: ${res.status} ${res.statusText} ${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/products`
      )
    }
    const data = await res.json()
    return data
  } catch (error) {
    throw new Error(
      `Failed to fetch products api: ${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/products`
    )
  }
}

/**
 * Processes the products array and returns an object with arrays of products grouped and sorted by product_family.
 * @param {Array} products - The array of products to process.
 * @returns {Object} The processed products object.
 */
const processData = (products) => {
  const sortedProducts = products.sort((a, b) => {
    if (a.product_family !== b.product_family) {
      return a.product_family.localeCompare(b.product_family)
    }
    if (a.years !== b.years) {
      return a.years - b.years
    }
    return a.units_from - b.units_from
  })

  const processedProducts = {
    all: sortedProducts.map((product) => ({ ...product })),
  }
  sortedProducts.forEach((product) => {
    const productFamily = product.product_family
    if (!processedProducts[productFamily]) {
      processedProducts[productFamily] = []
    }
    processedProducts[productFamily].push({ ...product })
  })

  return processedProducts
}

const fetchAndProcessProducts = async () => {
  const products = await fetchProducts()
  return processData(products)
}

export default fetchAndProcessProducts
