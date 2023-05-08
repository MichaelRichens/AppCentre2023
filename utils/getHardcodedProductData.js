function getHardcodedProductData() {
	if (!process.env.NEXT_PUBLIC_HARDCODED_PRODUCT_DATA) {
		throw new Error('Environment variable NEXT_PUBLIC_HARDCODED_PRODUCT_DATA is not defined.')
	}

	try {
		const hardcodedProductData = JSON.parse(process.env.NEXT_PUBLIC_HARDCODED_PRODUCT_DATA)
		return hardcodedProductData
	} catch (error) {
		throw new Error('Error parsing hardcoded product data from environment variable: ' + error.message)
	}
}

export default getHardcodedProductData
