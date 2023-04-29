import { useContext } from 'react'
import { ProductsContext } from '../contexts/ProductsContext'

/**
 * useProducts is a custom hook that returns all products from the ProductsContext.
 * @returns {Array} The products array.
 */
const useProducts = () => {
  const { products } = useContext(ProductsContext)
  return products
}

export default useProducts
