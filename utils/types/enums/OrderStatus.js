const CartActionsEnum = {
	CHECKOUT: 'CHECKOUT', //checkout process started with this order (stripe session created basically)
	EXPIRED: 'EXPIRED', //checkout was not completed and the stripe session has expired
	PAID: 'PAID', //payment has been made
	COMPLETE_NO_PAYMENT: 'COMPLETE_NO_PAYMENT', //order was completed an no payment required (its a status stripe can provide if we create a checkout with 0 cost)
	FAILED: 'FAILED', //payment was attempted but declined (or failed for some reason anyway)
	REFUNDED: 'REFUNDED', //Refund has been made
	UPDATE_ERROR: 'UPDATE_ERROR', //We don't know, something went wrong and we don't have anything better value to set.
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
