import React from 'react'
import { RotatingLines } from 'react-loader-spinner'

const ConfiguratorAddToCart = ({ haveJustChangedType, displayPrice, addToCartInProgress, allowAddToCart }) => {
	if (allowAddToCart === undefined) {
		allowAddToCart = true
	}
	return (
		<>
			<p aria-live={haveJustChangedType ? 'off' : 'polite'}>{displayPrice}</p>
			{addToCartInProgress ? (
				<RotatingLines
					width='32'
					animationDuration='1.5'
					strokeColor='#666'
					color='#243059'
					ariaLabel='Adding to Cart'
				/>
			) : (
				<button type='submit' disabled={!allowAddToCart}>
					Add to Cart
				</button>
			)}
		</>
	)
}

export default ConfiguratorAddToCart
