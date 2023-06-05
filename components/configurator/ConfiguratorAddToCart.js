import React from 'react'
import { RotatingLines } from 'react-loader-spinner'
import BusyButton from '../BusyButton'

const ConfiguratorAddToCart = ({ haveJustChangedType, displayPrice, addToCartInProgress, allowAddToCart }) => {
	if (allowAddToCart === undefined) {
		allowAddToCart = true
	}
	return (
		<>
			<p aria-live={haveJustChangedType ? 'off' : 'polite'}>{displayPrice}</p>
			<BusyButton isBusy={addToCartInProgress} type='submit' disabled={!allowAddToCart} busyAriaLabel='Adding to Cart'>
				Add to Cart
			</BusyButton>
		</>
	)
}

export default ConfiguratorAddToCart
