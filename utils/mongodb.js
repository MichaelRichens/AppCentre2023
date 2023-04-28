import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let cachedClient = null

export async function connectToDatabase() {
  if (cachedClient) {
    console.log('cached client')
    return { client: cachedClient }
  }
  console.log('requesting from mongodb')
  const client = await MongoClient.connect(uri, options)
  console.log('client')
  console.log(client)
  cachedClient = client
  return { client }
}
