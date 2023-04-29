import { createContext, useState, useEffect } from 'react'

/**
 * ProductsContext holds the state for processed products and provides methods to fetch, process, and update them.
 */
const ProductsContext = createContext()

/**
 * ProductsProvider is a wrapper component that provides the ProductsContext to its children.
 */
const ProductsProvider = ({ children }) => {
  const [processedProducts, setProcessedProducts] = useState({})

  /**
   * Fetches all products from the API.
   * @returns {Promise<Array>} The fetched products array.
   */
  const fetchProducts = async () => {
    const response = await fetch('/api/products')
    const data = await response.json()
    return data
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

    const processedProducts = { all: sortedProducts }
    sortedProducts.forEach((product) => {
      const productFamily = product.product_family
      if (!processedProducts[productFamily]) {
        processedProducts[productFamily] = []
      }
      processedProducts[productFamily].push(product)
    })

    return processedProducts
  }

  // Fetch and store all processed products when the context is created.
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts()
      const processedData = processData(data)
      setProcessedProducts(processedData)
    }
    fetchData()
  }, [])

  return (
    <ProductsContext.Provider
      value={{
        fetchProducts,
        processData,
        processedProducts,
      }}>
      {children}
    </ProductsContext.Provider>
  )
}

export { ProductsContext, ProductsProvider }
