import React, { useContext, useEffect, useState } from 'react'
import { FlashMessageContext } from './contexts/FlashMessageContext'
import MessageType from '../utils/types/enums/MessageType'

import styles from '../styles/FlashMessage.module.css'

const FlashMessage = () => {
	const { message, setMessage } = useContext(FlashMessageContext)

	const [isInDom, setIsInDom] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const [timer, setTimer] = useState(null)
	const [fadeOutTimer, setFadeOutTimer] = useState(null)

	useEffect(() => {
		if (message) {
			// Clear old timers
			if (timer) clearTimeout(timer)
			if (fadeOutTimer) clearTimeout(fadeOutTimer)

			setIsInDom(true)
			setIsVisible(true)

			const newTimer = setTimeout(() => {
				setIsVisible(false)

				const newFadeOutTimer = setTimeout(() => {
					setIsInDom(false)
					setMessage(null)
				}, 1000) // This should match the duration of the css fade out transition - 1 second

				setFadeOutTimer(newFadeOutTimer)
			}, 3000) // stay visible time - 2 seconds

			setTimer(newTimer)
		}
	}, [message])

	if (!isInDom || !message) return null

	if (!(typeof message === 'object' && message !== null && 'text' in message && message.text !== undefined)) {
		console.error('Malformed message object without a valid text property - received: ', message)
		return null
	}

	let className
	switch (message?.type) {
		case MessageType.ERROR:
			className = `${styles.flashMessage} ${styles.errorMessage}`
			break
		case MessageType.SUCCESS:
			className = `${styles.flashMessage} ${styles.successMessage}`
			break
		default:
			// Includes MessageType.INFO and just not being set
			className = `${styles.flashMessage} ${styles.infoMessage}`
	}

	className += isVisible ? ` ${styles.visible}` : ''

	return (
		<aside className={styles.flashMessageWrapper}>
			<div className={className} aria-live='polite'>
				{message.text}
			</div>
		</aside>
	)
}

export default FlashMessage
