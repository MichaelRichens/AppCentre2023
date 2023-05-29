const CartActionsEnum = {
	CHECKOUT: 'CHECKOUT', //checkout process started with this order (stripe session created basically)
	EXPIRED: 'EXPIRED', //checkout was not completed and the stripe session has expired
}

// Use a proxy in dev mode so it throws an error on a non-existent value
const OrderStatus =
	process.env.NODE_ENV === 'development'
		? new Proxy(CartActionsEnum, {
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid CartAction: ${name}`)
					}
				},
		  })
		: CartActionsEnum

export default OrderStatus
