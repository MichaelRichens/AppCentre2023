import { connectToDatabase } from '../../utils/mongodb'

export default async function handler(req, res) {
  const { product_family } = req.query

  try {
    const client = await connectToDatabase()
    const db = client.db('appcentre')
    const productsCollection = db.collection('products')

    const products = await productsCollection.find({ product_family }).toArray()

    res.status(200).json(products)
  } catch (error) {
    console.error('Error querying products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
