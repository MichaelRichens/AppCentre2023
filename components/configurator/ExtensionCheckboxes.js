import React from 'react'
import configuratorStyles from '../../styles/Configurator.shared.module.css'

const ExtensionCheckboxes = ({
	legend,
	availableExtensions,
	selectedExtensions,
	onChange,
}) => {
	if (availableExtensions.length === 0) {
		return null
	}
	return (
		<fieldset className={configuratorStyles.checkbox}>
			<legend>{legend}</legend>
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
		</fieldset>
	)
}

export default ExtensionCheckboxes
