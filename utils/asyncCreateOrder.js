const asyncCreateOrder = async (configId) => {
	try {
		const response = await fetch('/api/create-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				config_id: configId,
			}),
		})
		const data = await response.json()
		return data.id
	} catch (error) {
		console.error(error)
	}
}

export default asyncCreateOrder
