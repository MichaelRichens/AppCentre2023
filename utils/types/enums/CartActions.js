const CartActionsEnum = {
	ADD_ITEM: 'ADD_ITEM',
	REMOVE_ITEM: 'REMOVE_ITEM',
	CLEAR_CART: 'CLEAR_CART',
	UPDATE_ITEM: 'UPDATE_ITEM',
}

// Use a proxy in dev mode so it throws an error on a non-existent value
const CartActions =
	process.env.NODE_ENV === 'development'
		? new Proxy(CartActionsEnum, {
				// The `get` method is called whenever a property on CartActions is accessed.
				// If the property exists on the CartActionsEnum object, its value is returned.
				// If the property doesn't exist, we throw an error.
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid CartAction: ${name}`)
					}
				},
		  })
		: CartActionsEnum

export default CartActions
