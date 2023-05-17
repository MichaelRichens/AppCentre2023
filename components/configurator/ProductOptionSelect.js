import React from 'react'
import { createHandleOptionChange } from '../../utils/configuratorHandleFunctions'

const ProductOptionSelect = ({ productDataArray, currentOptionIndex, updateFormData }) => {
	const handleOptionChange = createHandleOptionChange(updateFormData)

	return (
		<>
			<select onChange={handleOptionChange} defaultValue={currentOptionIndex}>
				{productDataArray.map((productData, index) => (
					<option key={index} value={index}>
						{productData.name}
					</option>
				))}
			</select>
		</>
	)
}

export default ProductOptionSelect
