/**
 * Generates a unique identifier with an optional prefix.
 *
 * @param {string} [prefix=""] - Optional prefix to prepend to the generated ID.
 * @returns {string} A unique identifier.
 */
export function generateUniqueId(prefix = '') {
	// Generate a random number between 0 and 10^9
	const randomNumber = Math.floor(Math.random() * Math.pow(10, 9))
	return `${prefix}${Date.now()}${randomNumber}`
}

/**
 * Generates a random string key consisting of uppercase letters.
 * @param {number} length - The length of the generated key. Must be an integer of 3 or more.
 * @returns {string} The generated random key with the specified length.
 * @throws {Error} If the length is less than 3.
 */
export function generateAlphaId(length) {
	if (length < 3) {
		throw new Error('Length must be an integer of 3 or more.')
	}

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const unwantedStrings = ['ARSE', 'ASS', 'CUNT', 'ERROR', 'FOOL', 'FUCK', 'PRAT', 'SHIT'] // Should really add some more of these
	let result = ''

	do {
		result = ''
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length))
		}
	} while (containsUnwanted(result, unwantedStrings))

	return result
}

function containsUnwanted(str, unwantedStrings) {
	for (let word of unwantedStrings) {
		if (str.includes(word)) {
			return true
		}
	}
	return false
}
