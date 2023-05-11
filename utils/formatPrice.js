/**
 * Formats the given price as a string in GBP currency and adds ' + vat' at the end.
 *
 * @param {number} price - The price to be formatted.
 * @returns {string} The formatted price string with ' + vat' appended.
 */
const formatPrice = (price) => {
	const formattedPrice = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: process.env.NEXT_PUBLIC_CURRENCY_UC,
	}).format(price)
	return `${formattedPrice} + vat`
}

export default formatPrice
