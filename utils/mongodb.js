// TODO put some kind of fixed ip proxy in between this and mongodb
// Currently it connects directly, and therefore mongodb has to be configured to allow connections from anywhere
// Would be nice to lock it down...

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client

export async function connectToDatabase() {
  if (!client || !client.isConnected()) {
    client = await MongoClient.connect(uri, options)
  }

  return client
}
