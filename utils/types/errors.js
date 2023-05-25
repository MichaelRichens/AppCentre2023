/**
 * VersioningError class extends the built-in Error class in JavaScript.
 * It represents an error that occurs when a required version of something
 * (like a software or a feature) is not met by the actual version.
 *
 * @extends {Error}
 */
export class VersioningError extends Error {
	/**
	 * Creates a new VersioningError.
	 *
	 * @param {string} [message=''] - The error message.
	 * @param {string} [actualVersion=''] - The actual version that was used.
	 * @param {string} [requiredVersion=''] - The required version that was not met.
	 */
	constructor(message = '', actualVersion = '', requiredVersion = '') {
		super(message)
		this.actualVersion = actualVersion
		this.requiredVersion = requiredVersion
	}
}
