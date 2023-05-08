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
	let result = ''

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}

	return result
}

export default generateKey
