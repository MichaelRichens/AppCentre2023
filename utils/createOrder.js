const createOrder = (configId) => {
	return fetch('/api/create-order', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			config_id: configId,
		}),
	})
		.then((res) => res.json())
		.then((data) => data.id)
}

export default createOrder
