import { useContext, useState, useEffect } from 'react'
import { ProductsContext } from '../contexts/ProductsContext'

/**
 * useProducts is a custom hook that returns products based on the given productFamily.
 * It updates the products state in the ProductsContext.
 * @param {string} [productFamily] - The product family to filter products by.
 * @returns {Array} The products array.
 */
const useProducts = (productFamily) => {
  const { products: allProducts, fetchProducts } = useContext(ProductsContext)
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    if (!productFamily) {
      setFilteredProducts(allProducts)
    } else {
      const fetchData = async () => {
        const data = await fetchProducts(productFamily)
        setFilteredProducts(data)
      }

      fetchData()
    }
  }, [productFamily, fetchProducts, allProducts])

  return filteredProducts
}

export default useProducts
