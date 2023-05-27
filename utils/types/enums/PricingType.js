const PricingTypeEnum = {
	UNIT: 'unit', // Pricing is done on a per unit (eg user) basis
	HARDSUB: 'hardsub', // Hardware with a subscription (per appliance, not per user or whatever)
}

// Use a proxy in dev mode so it throws an error on a non-existent value
const PricingType =
	process.env.NODE_ENV === 'development'
		? new Proxy(PricingTypeEnum, {
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid PricingType: ${name}`)
					}
				},
		  })
		: PricingTypeEnum

export default PricingType
