import React from 'react'
import ConfigurationSummary from '../../utils/types/ConfigurationSummary'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * SubscriptionSummary is a tightly coupled subcomponent of the SubscriptionConfigurator form
 * that displays a summary of the current subscription configuration based on its formData.
 *
 * @param {Object} props - The component props.
 * @param {ConfigurationSummary} props.configuration - Details of the configuration to summarise.
 * @param {boolean?} props.haveExtensionOptions - Are there any extensions available for this product?
 */

const SubscriptionSummary = ({ configuration, haveExtensionOptions }) => {
	return (
		<fieldset className={configuratorStyles.summary}>
			<legend>Summary</legend>
			<p>{configuration.product}</p>
			{haveExtensionOptions ? (
				<p>{configuration.extensions.length > 0 ? configuration.extensions : 'With no extensions'}</p>
			) : null}

			<p>{configuration.price}</p>
			<button type='submit'>Save</button>
		</fieldset>
	)
}

export default SubscriptionSummary
