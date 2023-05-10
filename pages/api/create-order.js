import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk'

export default async function handler(req, res) {
	// Make sure this is a POST request
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}

	// Set up PayPal environment
	let environment = new checkoutNodeJssdk.core.SandboxEnvironment(
		process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
		process.env.PAYPAL_SECRET
	)
	let client = new checkoutNodeJssdk.core.PayPalHttpClient(environment)

	// Set up request
	let request = new checkoutNodeJssdk.orders.OrdersCreateRequest()
	request.prefer('return=representation')
	request.requestBody({
		intent: 'CAPTURE',
		application_context: {
			shipping_preference: 'NO_SHIPPING', // Disables the shipping address.  Default is GET_FROM_FILE (will use customer's default paypal shipping addy)
		},
		purchase_units: [
			{
				amount: {
					currency_code: 'GBP',
					value: '2',
					breakdown: {
						item_total: {
							currency_code: 'GBP',
							value: '2',
						},
					},
				},
				items: [
					{
						name: 'Test Product 1',
						description: 'Test Product 1 - description',
						unit_amount: {
							currency_code: 'GBP',
							value: '1',
						},
						quantity: '2',
					},
				],
			},
		],
	})

	// Create the order
	let order
	try {
		order = await client.execute(request)
	} catch (err) {
		// Handle any errors from the call
		console.error(err)
		return res.status(500).json({ error: 'Error creating order' })
	}

	// Return the order ID
	res.status(200).json({ id: order.result.id })
}
