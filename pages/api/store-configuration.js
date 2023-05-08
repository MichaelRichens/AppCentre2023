export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { formData } = req.body
		if (formData !== null) {
			res.status(200).json({ message: 'Valid objects received.' })
		} else {
			res.status(400).json({ message: 'formData not received.' })
		}
	} else {
		res.status(405).json({ message: 'Method not allowed.' })
	}
}
