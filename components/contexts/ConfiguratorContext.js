import { createContext, useContext, useState } from 'react'

/**
 * ConfiguratorContext is a React context for managing and preserving the state
 * of multiple instances of ProductConfigurator components across different pages.
 *
 * It provides a way to store the form data keyed by the productFamily, so that
 * users can navigate between pages without the forms resetting.
 *
 * It is intended to wrap the whole app
 */

const ConfiguratorContext = createContext()

export const useConfiguratorContext = () => {
  return useContext(ConfiguratorContext)
}

export const ConfiguratorProvider = ({ children }) => {
  const [configuratorData, setConfiguratorData] = useState({})

  const saveConfiguratorData = (productFamily, formData) => {
    setConfiguratorData((prevData) => ({
      ...prevData,
      [productFamily]: formData,
    }))
  }

  return (
    <ConfiguratorContext.Provider
      value={{ configuratorData, saveConfiguratorData }}>
      {children}
    </ConfiguratorContext.Provider>
  )
}
