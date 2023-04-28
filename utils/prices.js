export const fetchPrice = async (
  productCode,
  numberOfUsers,
  numberOfYears,
  extensionCodes
) => {
  try {
    const response = await fetch('/api/get-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productCode,
        numberOfUsers,
        numberOfYears,
        extensionCodes,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return { gbp: data.price, hash: data.hash }
  } catch (error) {
    console.error('Error fetching price:', error.message)
    return null
  }
}
