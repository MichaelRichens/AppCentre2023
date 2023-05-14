import React from 'react'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

const ExtensionCheckboxes = ({ availableExtensions, selectedExtensions, onChange }) => {
	if (availableExtensions.length === 0) {
		return null
	}
	return (
		<>
			{availableExtensions.map((extension) => (
				<label key={extension.key} className={configuratorStyles.checkbox}>
					<input
						type='checkbox'
						name='extensions'
						value={extension.key}
						id={`extension-${extension.key}`}
						checked={selectedExtensions.includes(extension.key)}
						onChange={onChange}
					/>
					{extension.name}
				</label>
			))}
		</>
	)
}

export default ExtensionCheckboxes
