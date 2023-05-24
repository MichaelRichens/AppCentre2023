// Define the base Enum-like object for CartActions.
// This is a simple JavaScript object that maps your cart actions to their string representations.
const CartActionsEnum = {
	ADD_ITEM: 'ADD_ITEM',
	REMOVE_ITEM: 'REMOVE_ITEM',
	CLEAR_CART: 'CLEAR_CART',
	UPDATE_ITEM: 'UPDATE_ITEM',
}

// Depending on the environment, we define CartActions in different ways.
// In development, we want to use a Proxy to wrap CartActionsEnum, which will throw an error if we try to access a property that doesn't exist.
// In production, we want to avoid the overhead of the Proxy, so we use the base CartActionsEnum object directly.
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
		: // In production mode, we simply use the base Enum-like object.
		  CartActionsEnum

// Export the CartActions object for use in other modules.
export default CartActions
