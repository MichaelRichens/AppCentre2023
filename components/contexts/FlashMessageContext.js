import React, { createContext, useState } from 'react'

export const FlashMessageContext = createContext()

export const FlashMessageProvider = ({ children }) => {
	const [message, setMessage] = useState(null)

	return <FlashMessageContext.Provider value={{ message, setMessage }}>{children}</FlashMessageContext.Provider>
}

const MessageTypeEnum = {
	ERROR: 'ERROR',
	INFO: 'INFO',
	SUCCESS: 'SUCCESS',
}

// Use a proxy in dev mode so it throws an error on a non-existent value
export const MessageType =
	process.env.NODE_ENV === 'development'
		? new Proxy(MessageTypeEnum, {
				get(target, name) {
					if (name in target) {
						return target[name]
					} else {
						throw new Error(`Invalid MessageType: ${name}`)
					}
				},
		  })
		: MessageTypeEnum
