/**
 * Generates a random string key consisting of uppercase letters.
 * @param {number} length - The length of the generated key. Must be an integer of 3 or more.
 * @returns {string} The generated random key with the specified length.
 * @throws {Error} If the length is less than 3.
 */
function generateKey(length) {
	if (length < 3) {
		throw new Error('Length must be an integer of 3 or more.')
	}

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const unwantedStrings = ['FUCK', 'SHIT', 'CUNT', 'ARSE', 'FOOL', 'PRAT', 'ASS'] // Should really add some more of these
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

export default generateKey
