import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let cachedClient = null

export async function connectToDatabase() {
  if (cachedClient) {
    return { client: cachedClient }
  }
  const client = await MongoClient.connect(uri, options)
  cachedClient = client
  return { client }
}
