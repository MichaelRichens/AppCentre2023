/**
 * Generates a unique identifier with an optional prefix.
 *
 * @param {string} [prefix=""] - Optional prefix to prepend to the generated ID.
 * @returns {string} A unique identifier.
 */
function generateUniqueId(prefix = '') {
	// Generate a random number between 0 and 10^9
	const randomNumber = Math.floor(Math.random() * Math.pow(10, 9))
	return `${prefix}${Date.now()}${randomNumber}`
}

export default generateUniqueId
