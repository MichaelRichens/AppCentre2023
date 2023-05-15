import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

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
					global._mongoClient = await MongoClient.connect(uri, {
						useNewUrlParser: true,
						useUnifiedTopology: true,
					})
				}
				client = global._mongoClient
			} else {
				client = await MongoClient.connect(uri, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				})
			}

			process.once('SIGINT', closeClient)
			process.once('SIGTERM', closeClient)
			process.once('SIGQUIT', closeClient)
		}

		const db = client.db(dbName)
		cachedDb = db

		return db
	} catch (error) {
		console.error('Error acquiring database connection:', error)
		throw new Error('Failed to connect to the database.')
	}
}

function closeClient() {
	if (client) client.close()
}

export { connectToDatabase }
