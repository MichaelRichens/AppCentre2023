import { useContext } from 'react'
import { ProductsContext } from '../contexts/ProductsContext'

/**
 * useProducts is a custom hook that returns all products from the ProductsContext.
 * @returns {Object} The products object, it has a field 'all' containing all products, and other fields for each product_family.
 */
const useProducts = () => {
  const { processedProducts } = useContext(ProductsContext)
  return processedProducts
}

export default useProducts
