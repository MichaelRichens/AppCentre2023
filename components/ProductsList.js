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
