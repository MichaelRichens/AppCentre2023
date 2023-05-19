import React from 'react'
import { RotatingLines } from 'react-loader-spinner'
import ConfigurationSummary from '../../utils/types/ConfigurationSummary'

/**
 * SubscriptionSummary is a tightly coupled subcomponent of the Configurator form
 * that displays a summary of the current subscription configuration based on its formData.
 *
 * @param {Object} props - The component props.
 * @param {boolean?} props.allowAddToCart - Optionally can be passed as false to disable add to cart button.
 * @param {ConfigurationSummary} props.configuration - Details of the configuration to summarise.
 * @param {boolean?} props.haveExtensionOptions - Optional. Are there any extensions available for this product?
 * @param {boolean?} props.addToCartInProgress - Optional. Is there currently an add to cart operation in progress?
 * @param {boolean?} props.haveJustChangedType - Optionally can be passed as true to indicate the last change made to the configuration form was its type.
 */

const SubscriptionSummary = ({
	allowAddToCart,
	configuration,
	haveExtensionOptions,
	addToCartInProgress,
	haveJustChangedType,
}) => {
	if (allowAddToCart === undefined) {
		allowAddToCart = true
	}

	return (
		<>
			<p>{configuration.product}</p>
			{haveExtensionOptions ? (
				<p>{configuration.extensions.length > 0 ? configuration.extensions : 'With no extensions'}</p>
			) : null}

			<p aria-live={haveJustChangedType ? 'off' : 'polite'}>{configuration.price}</p>
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

export default SubscriptionSummary
