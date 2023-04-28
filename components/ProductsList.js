import { useState, useEffect } from 'react'

const ProductsList = ({ productFamily }) => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = productFamily
          ? `/api/products?product_family=${productFamily}`
          : '/api/products'
        const response = await fetch(url)
        const data = await response.json()

        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          setError(true)
          console.error('Unexpected data format:', data)
        }
      } catch (error) {
        setError(true)
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [productFamily])

  if (error) {
    return <p>Error fetching products. Please try again later.</p>
  }

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
