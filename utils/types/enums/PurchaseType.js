/**
 * PurchaseType Enum.
 *
 * @enum {string}
 * @readonly
 * @property {string} SUB - An extension of an existing subscription, which may have other options like units/users or extensions modified.
 * @property {string} NEW - A new subscription.
 * @property {string} ADD - Additional units/users to an existing subscription.
 * @property {string} EXT - Additional extension(s) to an existing subscription.
 */
const PurchaseType = Object.freeze({
  SUB: 'sub',
  NEW: 'new',
  ADD: 'add',
  EXT: 'ext',
})

export default PurchaseType
