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
