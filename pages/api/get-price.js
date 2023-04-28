export default async function handler(req, res) {
  // Check the referer header to make sure it matches the local domain
  // This is not real check - the referer header can be spoofed easily, and is just intended as a speed bump against random bots
  const referer = req.headers.referer
  const allowedReferers = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL,
    process.env.NEXT_PUBLIC_DEPLOY_URL,
  ]
  if (!referer || !allowedReferers.some((ref) => referer.startsWith(ref))) {
    return res.status(403).json({
      message: 'Access denied',
    })
  }

  const { productCode, numberOfUsers, numberOfYears, extensionCodes } = req.body

  // Validate the input parameters are present
  if (!productCode || !numberOfUsers || !numberOfYears || !extensionCodes) {
    return res.status(400).json({
      message: 'Missing required parameters',
    })
  }

  const price = calculatePrice(
    productCode,
    numberOfUsers,
    numberOfYears,
    extensionCodes
  )

  const hashCode = getHashCode(productCode, price)

  // Send the response
  res.status(200).json({
    price: price,
    hashCode: hashCode,
  })
}

function calculatePrice(
  productCode,
  numberOfUsers,
  numberOfYears,
  extensionCodes
) {
  // This is a dummy implementation
  const basePrice = 100
  const userPrice = 10 * numberOfUsers
  const yearPrice = 50 * numberOfYears
  const extensionPrice = extensionCodes.length * 20

  return basePrice + userPrice + yearPrice + extensionPrice
}

function getHashCode(productCode, price) {
  // This is a dummy implementation - will want to talk to shopping cart for this
  return `hash_${price}`
}
