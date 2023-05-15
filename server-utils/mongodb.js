import { MongoClient } from 'mongodb'

let cachedDb
let client

async function connectToDatabase() {
	if (cachedDb) {
		return cachedDb
	}

	try {
		if (!client) {
			if (process.env.NODE_ENV === 'development') {
				// In development mode, use a global variable so that the value
				// is preserved across module reloads caused by HMR (Hot Module Replacement).
				if (!global._mongoClient) {
					global._mongoClient = await getClient()
				}
				client = global._mongoClient
			} else {
				client = await getClient()
			}

			process.once('SIGINT', closeClient)
			process.once('SIGTERM', closeClient)
			process.once('SIGQUIT', closeClient)
		}

		const db = client.db(process.env.DB_NAME)
		cachedDb = db

		return db
	} catch (error) {
		console.error('Error acquiring database connection:', error)
		throw new Error('Failed to connect to the database.')
	}
}

async function getClient() {
	return await MongoClient.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

function closeClient() {
	if (client) client.close()
}

export { connectToDatabase }
