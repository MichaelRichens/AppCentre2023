/**
 * Formats the given price, passed in in pounds, as a string in GBP currency and adds ' + vat' at the end.
 *
 * @param {number} price - The price in pounds.
 * @param {boolean=true} showVatText - Whether ' + vat' should be displayed after the price.
 * @returns {string} The formatted price string with ' + vat' appended.
 */
export const formatPriceFromPounds = (price, showVatText = true) => {
	const formattedPrice = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: process.env.NEXT_PUBLIC_CURRENCY_UC,
	}).format(price)
	return `${formattedPrice}${showVatText ? ' (ex vat)' : ''}`
}

/**
 * Takes a price value in pennies, converts it to pounds by dividing by 100,
 * then formats the result as a string in GBP currency and adds ' + vat' at the end.
 *
 * This function is designed for compatibility with Stripe, which represents currency amounts in the smallest currency unit (e.g., pennies for GBP).
 *
 * @param {number} priceInPennies - The price in pennies.
 * @param {boolean=true} showVatText - Whether ' + vat' should be displayed after the price.
 * @returns {string} The formatted price string with ' + vat' appended.
 */
export const formatPriceFromPennies = (priceInPennies, showVatText = true) => {
	const priceInPounds = priceInPennies / 100
	return formatPriceFromPounds(priceInPounds, showVatText)
}
