function getHardcodedProductData() {
	if (!process.env.NEXT_PUBLIC_HARDCODED_PRODUCT_DATA) {
		throw new Error('Environment variable NEXT_PUBLIC_HARDCODED_PRODUCT_DATA is not defined.')
	}

	try {
		const hardcodedProductData = JSON.parse(process.env.NEXT_PUBLIC_HARDCODED_PRODUCT_DATA)

		// create familyName to hold the name property of the main family object (will get overwritten for options that specify their own name, so create it here since it will be needed in places)
		Object.keys(hardcodedProductData).forEach((productFamily) => {
			hardcodedProductData[productFamily].familyName = hardcodedProductData[productFamily].name
		})

		return hardcodedProductData
	} catch (error) {
		throw new Error('Error parsing hardcoded product data from environment variable: ' + error.message)
	}
}

export default getHardcodedProductData
