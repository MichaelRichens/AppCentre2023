import React from 'react'
import ConfigurationSummary from '../../utils/types/ConfigurationSummary'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

/**
 * SubscriptionSummary is a tightly coupled subcomponent of the SubscriptionConfigurator form
 * that displays a summary of the current subscription configuration based on its formData.
 *
 * @param {Object} props - The component props.
 * @param {ConfigurationSummary} props.configuration - Details of the configuration to summarise.
 */

const SubscriptionSummary = ({ configuration }) => {
  return (
    <fieldset className={configuratorStyles.summary}>
      <p>{configuration.product}</p>
      <p>{configuration.extensions}</p>
      <p>{configuration.price}</p>
    </fieldset>
  )
}

export default SubscriptionSummary
