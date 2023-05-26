import { useState, useEffect } from 'react'
import { generateUniqueId } from '../../utils/generateId'

function useUniqueId(prefix = '') {
	const [id, setId] = useState(null)

	useEffect(() => {
		const newId = generateUniqueId(prefix)
		setId(newId)
	}, [prefix])

	return id
}

export default useUniqueId
