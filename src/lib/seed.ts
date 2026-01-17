
import { collection, doc, writeBatch, Firestore } from 'firebase/firestore';
import { products, categories } from './mock-data';

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed categories
  const categoriesCollection = collection(db, 'categories');
  categories.forEach((category) => {
    const categoryRef = doc(categoriesCollection, category.id);
    batch.set(categoryRef, category);
  });
  console.log('Seeding categories...');

  // Seed products
  const productsCollection = collection(db, 'products');
  products.forEach((product) => {
    const productRef = doc(productsCollection, product.id);
    batch.set(productRef, product);
  });
  console.log('Seeding products...');

  // Commit the batch
  await batch.commit();
  console.log('Database seeded successfully!');
}
