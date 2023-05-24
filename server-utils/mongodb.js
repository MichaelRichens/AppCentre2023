import { MongoClient, ObjectId } from 'mongodb'

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

async function asyncUpdateRecord(collectionName, id, updatedProperties) {
	if (!id) {
		throw new Error('Id cannot be empty, null, or undefined.')
	}

	if (typeof id !== 'string') {
		throw new Error('Id must be a string.')
	}

	const _id = new ObjectId(id)
	if (updatedProperties.id && updatedProperties.id !== id) {
		throw new Error('Mismatch between id in updatedProperties and passed id.')
	}

	if (updatedProperties._id && updatedProperties._id !== id) {
		throw new Error('Mismatch between _id in updatedProperties and passed id.')
	}

	try {
		const db = await connectToDatabase()
		const collection = db.collection(collectionName)

		const result = await collection.updateOne({ _id }, { $set: updatedProperties })

		if (result.matchedCount === 0) {
			throw new Error(`No document found with id: ${id}`)
		}

		if (result.modifiedCount !== 1) {
			throw new Error(`Unable to update document with id: ${id}`)
		}

		return result
	} catch (error) {
		console.error('Error updating record:', error)
		throw error
	}
}

export { connectToDatabase, asyncUpdateRecord }
