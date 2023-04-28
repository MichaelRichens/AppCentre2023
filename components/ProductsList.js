import { useState, useEffect } from 'react'

const ProductsList = ({ productFamily }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?product_family=${productFamily}`
        )
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [productFamily])

  return (
    <ul>
      {products.map((product) => (
        <li key={product.sku}>
          <div>Product Family: {product.product_family}</div>
          <div>SKU: {product.sku}</div>
          <div>Units From: {product.units_from}</div>
          <div>Units To: {product.units_to}</div>
          <div>Years: {product.years}</div>
          <div>Price: {product.price}</div>
        </li>
      ))}
    </ul>
  )
}

export default ProductsList
