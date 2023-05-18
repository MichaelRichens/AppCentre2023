/**
 * createUnitName function.
 *
 * @function
 * This function creates an object representing a word in both
 * its singular and plural forms. The function takes two arguments:
 * singular and plural. The created object has four properties: singularLC, pluralLC,
 * singularC, and pluralC. These properties store the singular and plural forms
 * of the word in lowercase and with the first letter capitalised, respectively.
 * The returned object is a plain JavaScript object.
 * @param {string} singular - The singular form.
 * @param {string} plural - The plural form.
 * @returns {Object} An object which provides singular and plural forms, both lowercase and with first letter capitalised.
 * 	@property {string} singularLC
 * 	@property {string} singularC
 * 	@property {string} pluralLC
 * 	@property {string} pluralC
 */
function createUnitName(singular, plural) {
	const singularLC = singular.toLowerCase()
	const pluralLC = plural.toLowerCase()
	const singularC = capitalise(singular.toLowerCase())
	const pluralC = capitalise(plural.toLowerCase())

	return {
		singularLC,
		pluralLC,
		singularC,
		pluralC,
	}

	// Helper function to capitalise the first letter of a word
	function capitalise(word) {
		return word.charAt(0).toUpperCase() + word.slice(1)
	}
}

export default createUnitName
