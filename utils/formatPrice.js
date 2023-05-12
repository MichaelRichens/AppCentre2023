/**
 * Formats the given price, passed in in pounds, as a string in GBP currency and adds ' + vat' at the end.
 *
 * @param {number} price - The price in pounds.
 * @returns {string} The formatted price string with ' + vat' appended.
 */
export const formatPriceFromPounds = (price) => {
	const formattedPrice = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: process.env.NEXT_PUBLIC_CURRENCY_UC,
	}).format(price)
	return `${formattedPrice} + vat`
}

/**
 * Takes a price value in pennies, converts it to pounds by dividing by 100,
 * then formats the result as a string in GBP currency and adds ' + vat' at the end.
 *
 * This function is designed for compatibility with Stripe and use-shopping-cart,
 * both of which represent currency amounts in the smallest currency unit (e.g., pennies for GBP).
 *
 * @param {number} priceInPennies - The price in pennies.
 * @returns {string} The formatted price string with ' + vat' appended.
 */
export const formatPriceFromPennies = (priceInPennies) => {
	const priceInPounds = priceInPennies / 100
	return formatPriceFromPounds(priceInPounds)
}
