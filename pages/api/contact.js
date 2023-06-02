import sgMail from '@sendgrid/mail'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(req, res) {
	const { name, email, emailBody, business } = req.body

	// this is a honeypot field
	if (business) {
		return res.status(401).end('Not Authorised.')
	}

	// validate that the request comes with a valid firebase token.
	const decodedToken = await asyncDecodeFirebaseToken(req?.headers?.authorization)

	if (!decodedToken) {
		if (decodedToken === null) {
			console.error('create-checkout-session endpoint. Invalid authorization header format.')
			return res.status(401).end('Not Authorised.')
		}
		console.error('create-checkout-session endpoint. Error when verifying token with firebase')
		return res.status(403).end('Forbidden')
	}

	const content = {
		to: 'info@appcentre.co.uk',
		from: 'info@appcentre.co.uk',
		replyTo: email,
		subject: `Enquiry From ${name}`,
		text: emailBody,
	}

	try {
		await sgMail.send(content)
		return res.status(200).send('Message sent successfully.')
	} catch (error) {
		console.error('SendGrid Error:', error)
		console.log('Errors Array:')
		error?.response?.body?.errors.forEach((error) => console.log(error))
		return res.status(400).send('Message not sent.')
	}
}
