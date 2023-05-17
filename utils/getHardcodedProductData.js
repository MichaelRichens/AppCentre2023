export function getHardcodedProductData() {
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

// Create a hardcoded data object hcData, which takes data from the getHardcodedProductData function.
// It will return all fields in the object at the productFamily property, unless they are overridden by those at that object's `options` object's productOption property
export function getHardcodedDataObject(productFamily, productOption) {
	const allHardcoded = getHardcodedProductData()
	const hcFamily = allHardcoded?.[productFamily] || {}
	const hcOption = productOption ? hcFamily?.options?.[productOption] : {}
	const { options, ...hcFamilyExceptOptions } = hcFamily
	const hcData = { ...hcFamilyExceptOptions, ...hcOption } // the hardcoded values for this productData and productOption combo

	return hcData
}
