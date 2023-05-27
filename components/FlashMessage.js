import React, { useContext, useEffect, useState } from 'react'
import { FlashMessageContext } from './contexts/FlashMessageContext'
import MessageType from '../utils/types/enums/MessageType'

import styles from '../styles/FlashMessage.module.css'

const FlashMessage = () => {
	const { message, setMessage } = useContext(FlashMessageContext)

	const [isInDom, setIsInDom] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (message) {
			setIsInDom(true)
			setIsVisible(true)

			const timer = setTimeout(() => {
				setIsVisible(false)

				const fadeOutTimer = setTimeout(() => {
					setIsInDom(false)
					setMessage(null)
				}, 1000) // This should match the duration of the css fade out transition - 1 second

				return () => {
					clearTimeout(timer)
					clearTimeout(fadeOutTimer)
				}
			}, 2000) // stay visible time - 2 seconds
		}
	}, [message])

	if (!isInDom) return null

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
			<div className={className}>{message.text}</div>
		</aside>
	)
}

export default FlashMessage
