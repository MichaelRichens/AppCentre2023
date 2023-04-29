import { createContext, useState, useEffect } from 'react'

/**
 * ProductsContext holds the state for products and provides methods to fetch and update them.
 */
const ProductsContext = createContext()

/**
 * ProductsProvider is a wrapper component that provides the ProductsContext to its children.
 */
const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  /**
   * Fetches all products from the API.
   * @returns {Promise<Array>} The fetched products array.
   */
  const fetchProducts = async () => {
    const response = await fetch(`/api/products`)
    const data = await response.json()
    return data
  }

  // Fetch and store all products when the context is created.
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts()
      setProducts(data)
    }
    fetchData()
  }, [])

  return (
    <ProductsContext.Provider value={{ products, setProducts, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export { ProductsContext, ProductsProvider }
