import React from 'react'
import { RotatingLines } from 'react-loader-spinner'
import ConfigurationSummary from '../../utils/types/ConfigurationSummary'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * SubscriptionSummary is a tightly coupled subcomponent of the SubscriptionConfigurator form
 * that displays a summary of the current subscription configuration based on its formData.
 *
 * @param {Object} props - The component props.
 * @param {ConfigurationSummary} props.configuration - Details of the configuration to summarise.
 * @param {boolean?} props.haveExtensionOptions - Are there any extensions available for this product?
 * @param {boolean?} props.addToCartInProgress - Is there currently an add to cart operation in progress?
 */

const SubscriptionSummary = ({ configuration, haveExtensionOptions, addToCartInProgress }) => {
	return (
		<fieldset className={configuratorStyles.summary}>
			<legend>Summary</legend>
			<p>{configuration.product}</p>
			{haveExtensionOptions ? (
				<p>{configuration.extensions.length > 0 ? configuration.extensions : 'With no extensions'}</p>
			) : null}

			<p>{configuration.price}</p>
			{addToCartInProgress ? (
				<RotatingLines
					width='32'
					animationDuration='1.5'
					strokeColor='#666'
					color='#243059'
					ariaLabel='Adding to Cart'
				/>
			) : (
				<button type='submit'>Add to Cart</button>
			)}
		</fieldset>
	)
}

export default SubscriptionSummary
