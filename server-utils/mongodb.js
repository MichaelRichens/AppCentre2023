// TODO put some kind of fixed ip proxy in between this and mongodb
// Currently it connects directly, and therefore mongodb has to be configured to allow connections from anywhere
// Would be nice to lock it down...

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let cachedDb

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }

  try {
    const client = await MongoClient.connect(uri)
    const db = client.connect()
    cachedDb = db

    return cachedDb
  } catch (error) {
    console.error('Error acquiring database connection:', error)
    throw error
  }
}

export { connectToDatabase }
