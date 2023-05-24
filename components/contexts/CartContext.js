import React, { createContext, useReducer, useEffect } from 'react'
import CartActions from '../../utils/types/enums/CartActions'

const CartContext = createContext()

const cartReducer = (state, action) => {
	switch (action.type) {
		case CartActions.ADD_ITEM:
			return [...state, action.item]
		case CartActions.REMOVE_ITEM:
			return state.filter((item) => item.id !== action.id)
		case CartActions.CLEAR_CART:
			return []
		default:
			return state
	}
}

const CartProvider = ({ children }) => {
	const [cart, dispatch] = useReducer(cartReducer, [], () => {
		const localData = localStorage.getItem(process.env.NEXT_PUBLIC_CART_LOCALSTORAGE_KEY)
		return localData ? JSON.parse(localData) : []
	})

	useEffect(() => {
		localStorage.setItem(process.env.NEXT_PUBLIC_CART_LOCALSTORAGE_KEY, JSON.stringify(cart))
	}, [cart])

	const addToCart = (item) => {
		dispatch({ type: CartActions.ADD_ITEM, item })
	}

	const removeFromCart = (id) => {
		dispatch({ type: CartActions.REMOVE_ITEM, id })
	}

	const clearCart = () => {
		dispatch({ type: CartActions.CLEAR_CART })
	}

	const getItem = (id) => {
		return cart.find((item) => item.id === id)
	}

	const getTotalItems = () => {
		return cart.length
	}

	const getTotalPrice = () => {
		return cart.reduce((total, item) => total + item.price, 0)
	}

	return (
		<CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getItem, getTotalItems, getTotalPrice }}>
			{children}
		</CartContext.Provider>
	)
}

export { CartContext, CartProvider }
