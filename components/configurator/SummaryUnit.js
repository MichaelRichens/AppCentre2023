import React from 'react'
import { ConfigurationSummaryUnit } from '../../utils/types/ConfigurationSummary'

import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * SummaryUnit provides an element which summaries a PricingType.UNIT style configuration
 *
 * @param {Object} props - The component props.
 * @param {ConfigurationSummaryUnit} props.configuration - Details of the configuration to summarise.
 * @param {boolean?} props.haveExtensionOptions - Optional. Are there any extensions available for this product?
 */

const SummaryUnit = ({ configuration, haveExtensionOptions }) => {
	return (
		<>
			<p>{configuration.product}</p>
			{haveExtensionOptions ? (
				<p>{configuration.extensions.length > 0 ? configuration.extensions : 'With no extensions'}</p>
			) : null}
		</>
	)
}

export default SummaryUnit
