import { connectToDatabase } from '../../utils/mongodb'

/**
 * API route handler for fetching all products.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default async function handler(req, res) {
  try {
    const client = await connectToDatabase()
    const db = client.db(process.env.DB_NAME)
    const productsCollection = db.collection('products')

    const products = await productsCollection.find({}).toArray()

    res.status(200).json(products)
  } catch (error) {
    console.error('Error querying products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
