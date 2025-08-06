// scripts/migrateProductsCJS.js
const { initializeApp } = require("firebase/app");
const { getFirestore, addDoc, collection, serverTimestamp } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkaEpBFuUizKnjl6LAt6FEx499pDHVPZs",
  authDomain: "vihar-app-f6b07.firebaseapp.com",
  projectId: "vihar-app-f6b07",
  storageBucket: "vihar-app-f6b07.firebasestorage.app",
  messagingSenderId: "768229718089",
  appId: "1:768229718089:web:e0fde908462429e731e798",
  measurementId: "G-441FJPXRL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const FIREBASE_DB = getFirestore(app);

const products = [
  {
    name: 'HP Gas 14.2kg',
    type: 'gas',
    weight: 14.2,
    price: 850,
    originalPrice: 900,
    deliveryCharge: 30,
    description: 'A standard domestic cooking gas cylinder, perfect for everyday kitchen use. Reliable, safe, and delivered to your doorstep.',
    image: 'https://your-storage-url.com/gas-cylinder.jpg', // Replace with actual URL after uploading
    inStock: true,
  },
  {
    name: 'HP Gas 19kg',
    type: 'gas',
    weight: 19,
    price: 1200,
    originalPrice: 1250,
    deliveryCharge: 50,
    description: 'A commercial-grade gas cylinder designed for restaurants, hotels, and other high-demand businesses.',
    image: 'https://your-storage-url.com/gas-cylinder.jpg', // Replace with actual URL after uploading
    inStock: true,
  },
  {
    name: 'HP Gas 5kg',
    type: 'gas',
    weight: 5,
    price: 450,
    originalPrice: 55,
    deliveryCharge: 20,
    description: 'A small and portable cylinder, ideal for outdoor activities, camping trips, and small-scale cooking needs.',
    image: 'https://your-storage-url.com/gas-cylinder.jpg', // Replace with actual URL after uploading
    inStock: false,
  },
  // Add your new product
  {
    name: '14.2kg Domestic Cylinder',
    type: 'gas',
    weight: 14.2,
    price: 950,
    originalPrice: 1000,
    deliveryCharge: 30,
    description: 'Standard domestic cooking gas cylinder for everyday kitchen use.',
    image: 'https://your-storage-url.com/gas-cylinder.jpg', // Replace with actual URL
    inStock: true,
  }
];

const migrateProducts = async () => {
  const productsCollection = collection(FIREBASE_DB, 'products');
  
  for (const product of products) {
    try {
      await addDoc(productsCollection, {
        ...product,
        createdAt: serverTimestamp()
      });
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }
  
  console.log('Migration completed');
};

migrateProducts();
