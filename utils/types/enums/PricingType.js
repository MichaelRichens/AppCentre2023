// Define the base Enum-like object for PricingType.
// This is a simple JavaScript object that maps your pricing types to their string representations.
const PricingTypeEnum = {
	UNIT: 'unit', // Pricing is done on a per unit (eg user) basis
	HARDSUB: 'hardsub', // Hardware with a subscription (per appliance, not per user or whatever)
}

// Depending on the environment, we define PricingType in different ways.
// In development, we want to use a Proxy to wrap PricingTypeEnum, which will throw an error if we try to access a property that doesn't exist.
// In production, we want to avoid the overhead of the Proxy, so we use the base PricingTypeEnum object directly.
const PricingType =
	process.env.NODE_ENV === 'development'
		? new Proxy(PricingTypeEnum, {
				// The `get` method is called whenever a property on PricingType is accessed.
				// If the property exists on the PricingTypeEnum object, its value is returned.
				// If the property doesn't exist, we throw an error.
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid PricingType: ${name}`)
					}
				},
		  })
		: // In production mode, we simply use the base Enum-like object.
		  PricingTypeEnum

// Export the PricingType object for use in other modules.
export default PricingType
