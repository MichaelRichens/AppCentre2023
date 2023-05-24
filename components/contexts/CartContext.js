import React, { createContext, useReducer, useEffect, useState } from 'react'
import CartActions from '../../utils/types/enums/CartActions'

/**
 * @warning ALL PRICES ARE STORED IN PENNIES, NOT POUNDS
 */
const CartContext = createContext()

const cartReducer = (state, action) => {
	switch (action.type) {
		case CartActions.ADD_ITEM:
			return [...state, action.item]
		case CartActions.REMOVE_ITEM:
			return state.filter((item) => item.id !== action.id)
		case CartActions.UPDATE_ITEM:
			return state.map((item) => (item.id === action.id ? { ...item, ...action.updates } : item))
		case CartActions.CLEAR_CART:
			return []
		default:
			return state
	}
}

/**
 * @warning ALL PRICES ARE STORED IN PENNIES, NOT POUNDS
 */
const CartProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true)

	const [cart, dispatch] = useReducer(cartReducer, [], () => {
		// Check if code is running on the client-side
		if (typeof window !== 'undefined') {
			const localData = localStorage.getItem(process.env.NEXT_PUBLIC_CART_LOCALSTORAGE_KEY)
			return localData ? JSON.parse(localData) : []
		}
		// Default state for server-side rendering
		return []
	})

	useEffect(() => {
		// Check if code is running on the client-side
		if (typeof window !== 'undefined') {
			localStorage.setItem(process.env.NEXT_PUBLIC_CART_LOCALSTORAGE_KEY, JSON.stringify(cart))
		}
		setIsLoading(false)
	}, [cart])

	const isCartLoading = () => {
		return isLoading
	}

	const addToCart = (item) => {
		dispatch({ type: CartActions.ADD_ITEM, item })
	}

	const removeFromCart = (id) => {
		dispatch({ type: CartActions.REMOVE_ITEM, id })
	}

	const updateItem = (id, updates) => {
		dispatch({ type: CartActions.UPDATE_ITEM, id, updates })
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
		<CartContext.Provider
			value={{
				cart,
				isCartLoading,
				addToCart,
				removeFromCart,
				updateItem,
				clearCart,
				getItem,
				getTotalItems,
				getTotalPrice,
			}}>
			{children}
		</CartContext.Provider>
	)
}

export { CartContext, CartProvider }
