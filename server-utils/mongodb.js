import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME

let cachedDb
let client

let conCount = 0
let conNewCount = 0

async function connectToDatabase() {
	if (cachedDb) {
		console.log('conCount:', ++conCount)
		return cachedDb
	}
	console.log('conNewCount:', ++conNewCount)
	try {
		client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		const db = client.db(dbName)
		cachedDb = db

		return db
	} catch (error) {
		console.error('Error acquiring database connection:', error)
		throw new Error('Failed to connect to the database.')
	}
}

// Close the connection when the application shuts down
process.once('SIGINT', closeClient)
process.once('SIGTERM', closeClient)
process.once('SIGQUIT', closeClient)

function closeClient() {
	if (client) client.close()
}

export { connectToDatabase }
