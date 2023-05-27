import React, { createContext, useState } from 'react'

export const FlashMessageContext = createContext()

export const FlashMessageProvider = ({ children }) => {
	const [message, setMessage] = useState(null)

	return <FlashMessageContext.Provider value={{ message, setMessage }}>{children}</FlashMessageContext.Provider>
}
