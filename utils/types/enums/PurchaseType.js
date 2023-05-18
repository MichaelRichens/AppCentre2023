// Define the base Enum-like object.
// This is a simple JavaScript object that maps your purchase types to their string representations.
const PurchaseTypeEnum = {
	SUB: 'sub', // A renewal of an existing subscription
	NEW: 'new', // A new purchase
	ADD: 'add', // Additional units/users to an existing subscription
	EXT: 'ext', // Additional extension(s) to an existing subscription
	SPARE: 'spare', // Spare hardware (for a customer who has a subscription to the service that uses the hardware)
	WAREX: 'warex', // A warranty extension
	ACC: 'acc', // Accessories
}

// Depending on the environment, we define PurchaseType in different ways.
// In development, we want to use a Proxy to wrap PurchaseTypeEnum, which will throw an error if we try to access a property that doesn't exist.
// In production, we want to avoid the overhead of the Proxy, so we use the base PurchaseTypeEnum object directly.
const PurchaseType =
	process.env.NODE_ENV === 'development'
		? new Proxy(PurchaseTypeEnum, {
				// The `get` method is called whenever a property on PurchaseType is accessed.
				// If the property exists on the PurchaseTypeEnum object, its value is returned.
				// If the property doesn't exist, we throw an error.
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid PurchaseType: ${name}`)
					}
				},
		  })
		: // In production mode, we simply use the base Enum-like object.
		  PurchaseTypeEnum

// Export the PurchaseType object for use in other modules.
export default PurchaseType
