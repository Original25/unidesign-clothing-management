// pages/api/add-product.js
import { getSession } from 'next-auth/react';
import { fetchProduct } from '../../services/apiService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { catalogReference } = req.body;

  try {
    const productData = await fetchProduct(catalogReference);

    if (!productData || productData.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Assuming productData is an array
    const productInfo = productData[0];

    // Map API data to database schema
    const product = await prisma.product.create({
      data: {
        supplierReference: productInfo.supplierReference,
        catalogReference: productInfo.catalogReference,
        brand: productInfo.brand,
        collection: productInfo.collection,
        description: productInfo.description.nl,
        createdDate: new Date(productInfo.createdDate),
        saleState: productInfo.saleState,
        imageUrl: productInfo.images[0],
        isOrganic: productInfo.organic ? true : false,
        isRecycled: productInfo.recycled ? true : false,
      },
    });

    // Process colors, sizes, and variants
    // ... (additional code needed here)

    res.status(200).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
}
