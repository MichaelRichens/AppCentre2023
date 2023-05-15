import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

let cachedDb

async function connectToDatabase() {
	if (cachedDb) {
		return cachedDb
	}

	try {
		const client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		const db = client.db(dbName)
		cachedDb = db

		// Close the connection when the application shuts down
		process.on('SIGINT', () => client.close())
		process.on('SIGTERM', () => client.close())
		process.on('SIGQUIT', () => client.close())

		return db
	} catch (error) {
		console.error('Error acquiring database connection:', error)
		throw new Error('Failed to connect to the database.')
	}
}

export { connectToDatabase }
