import useProducts from './hooks/useProducts'
import Loading from './Loading'

const ProductsList = () => {
  const products = useProducts()

  if (!products.length) {
    return <Loading />
  }
  return (
    <ul>
      {products.map((product) => (
        <li key={product.sku}>
          <ul>
            <li>Product Family: {product.product_family}</li>
            <li>SKU: {product.sku}</li>
            <li>Units From: {product.units_from}</li>
            <li>Units To: {product.units_to}</li>
            <li>Years: {product.years}</li>
            <li>Price: {product.price}</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default ProductsList
