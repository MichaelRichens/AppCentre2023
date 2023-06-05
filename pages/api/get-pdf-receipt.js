// pages/api/pdf.js
import puppeteer from 'puppeteer'
import * as firebaseAdmin from 'firebase-admin'
import firebaseService from '../../server-utils/firebaseService'
import asyncDecodeFirebaseToken from '../../server-utils/asyncDecodeFirebaseToken'
import { ensureFirebaseInitialised } from '../../server-utils/firebaseAdminSDKInit'
import { baseUrlFromReq } from '../../utils/baseUrl'

ensureFirebaseInitialised()

export default async function handler(req, res) {
	const { uid } = await asyncDecodeFirebaseToken(req?.headers?.authorization)

	if (!uid) {
		if (uid === null) {
			console.error('get-pdf-receipt endpoint. Invalid authorization header format.')
			return res.status(401).end('Not Authorised.')
		}
		console.error('get-pdf-receipt endpoint. Error when verifying token with firebase')
		return res.status(403).end('Forbidden')
	}

	const { orderId } = req.query

	const ordersRef = firebaseService.collection('orders')
	const orderWithSameIdSnap = await ordersRef.where('orderId', '==', orderId).get()
	if (orderWithSameIdSnap.size !== 1) {
		// return a 403 not a 404 so that there is rote cannot be used to check for the existence of an order.
		return res.status(403).end('Forbidden')
	}
	const documentData = orderWithSameIdSnap.docs[0].data()
	const userId = documentData.firebaseUserId

	if (userId !== uid) {
		console.error('get-pdf-receipt endpoint. UserId did not match token')
		return res.status(403).end('Forbidden')
	}

	// Create a custom token for the user
	const customToken = await firebaseAdmin.auth().createCustomToken(userId)

	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	const baseUrl = baseUrlFromReq(req)

	throw new Error('her be dragons')
	//TODO

	// Go to your login page and log in
	await page.goto(`${baseUrl}/login`)
	await page.evaluate((token) => {
		localStorage.setItem('customToken', token) // This assumes you use localstorage to save customToken, which will be used for login
	}, customToken)

	// TODO
	// Submit the form (or do whatever needed to perform login)
	// This depends on how your login is implemented
	// You may need to click a button or navigate directly to the dashboard, etc.

	// Wait for navigation to complete
	await page.waitForNavigation({ waitUntil: 'networkidle0' })

	// Now go to the receipt page
	await page.goto(`http://localhost:3000/receipt-pdf-source?orderId=${orderId}`)

	// Wait for the order details to be ready or fail
	await page.waitForSelector('#orderDetailsContent, #orderNotFound')

	// Check if generation failed
	const notFound = await page.$('#orderNotFound')
	if (notFound) {
		res.status(400).send('Order not found')
		await browser.close()
		return
	}

	const pdf = await page.pdf({ format: 'A4' })

	await browser.close()

	res.setHeader('Content-Type', 'application/pdf')
	res.setHeader('Content-Disposition', `attachment; filename=${orderId}.pdf`)
	res.send(pdf)
}
