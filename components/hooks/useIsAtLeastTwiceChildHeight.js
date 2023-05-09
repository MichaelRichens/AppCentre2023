import { useState, useEffect } from 'react'

/**
 * Custom hook that checks if a parent element is at least twice the height of its first child.
 * Intended for checking whether a horizontal element has flowed onto multiple rows.
 *
 * @param {React.RefObject} parentRef - A ref object pointing to the parent element.
 * @returns {boolean} - Returns true if the parent element is at least twice the height of its first child, else false.
 *
 * @example
 * const parentRef = useRef(null);
 * const isMultiRow = useIsAtLeastTwiceChildHeight(parentRef);
 */
const useIsAtLeastTwiceChildHeight = (parentRef) => {
	const [isAtLeastTwice, setIsAtLeastTwice] = useState(false)

	useEffect(() => {
		const checkHeight = () => {
			if (parentRef.current) {
				const parentHeight = parentRef.current.offsetHeight
				const childHeight = parentRef.current.firstElementChild.offsetHeight
				setIsAtLeastTwice(parentHeight >= 2 * childHeight)
			}
		}

		checkHeight()

		// Adding event listener for window resize
		window.addEventListener('resize', checkHeight)

		// Cleanup function to remove the listener when the component unmounts
		return () => {
			window.removeEventListener('resize', checkHeight)
		}
	}, [parentRef]) // Rerun the effect when parentRef changes

	return isAtLeastTwice
}

export default useIsAtLeastTwiceChildHeight
