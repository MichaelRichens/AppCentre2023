const PurchaseTypeEnum = {
	SUB: 'sub', // A renewal of an existing subscription
	NEW: 'new', // A new purchase
	ADD: 'add', // Additional units/users to an existing subscription
	EXT: 'ext', // Additional extension(s) to an existing subscription
	SPARE: 'spare', // Spare hardware (for a customer who has a subscription to the service that uses the hardware)
	WAREX: 'warex', // A warranty extension
}

// Use a proxy in dev mode so it throws an error on a non-existent value
const PurchaseType =
	process.env.NODE_ENV === 'development'
		? new Proxy(PurchaseTypeEnum, {
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid PurchaseType: ${name}`)
					}
				},
		  })
		: PurchaseTypeEnum

export default PurchaseType
