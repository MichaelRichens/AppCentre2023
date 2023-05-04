export const formatPrice = (price) => {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(price)
  return `${formattedPrice} + vat`
}
