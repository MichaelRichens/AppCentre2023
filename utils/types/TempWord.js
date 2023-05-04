/**
 * Word class definition.
 *
 * @module
 * This module provides a Word class that represents a word in both
 * its singular and plural forms. The class constructor takes two arguments:
 * singular and plural. The class has four properties: singularLC, pluralLC,
 * singularC, and pluralC. These properties store the singular and plural forms
 * of the word in lowercase and with the first letter capitalized, respectively.
 * Once an instance of the Word class is created, it is immutable.
 */

class Word {
  constructor(singular, plural) {
    this.singularLC = singular.toLowerCase()
    this.pluralLC = plural.toLowerCase()
    this.singularC = this.capitalize(singular.toLowerCase())
    this.pluralC = this.capitalize(plural.toLowerCase())

    // Make the object immutable
    Object.freeze(this)
  }

  // Helper method to capitalize the first letter of a word
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
}

export default Word
