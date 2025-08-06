// Database clearing script for HP Gas App
// This script removes all data from Firestore collections
// WARNING: This will delete all data! Use with caution.
// Run with: node scripts/clearDatabase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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
const db = getFirestore(app);

// Collections to clear
const collectionsToClean = [
  'users',
  'products',
  'orders',
  'delivery_agents'
];

// Function to clear a collection
async function clearCollection(collectionName) {
  try {
    console.log(`Clearing collection: ${collectionName}...`);
    
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`✓ Collection ${collectionName} is already empty`);
      return 0;
    }
    
    const deletePromises = [];
    snapshot.docs.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, collectionName, document.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(`✓ Cleared ${snapshot.size} documents from ${collectionName}`);
    return snapshot.size;
    
  } catch (error) {
    console.error(`✗ Error clearing collection ${collectionName}:`, error.message);
    return 0;
  }
}

// Main clearing function
async function clearDatabase() {
  try {
    console.log('🧹 Starting database cleanup...\n');
    
    let totalDeleted = 0;
    
    for (const collectionName of collectionsToClean) {
      const deleted = await clearCollection(collectionName);
      totalDeleted += deleted;
    }
    
    console.log(`\n🎉 Database cleanup completed!`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log('\n⚠️  Note: Firebase Auth users are NOT deleted by this script.');
    console.log('   You may need to manually delete them from Firebase Console if needed.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

// Confirmation prompt
console.log('⚠️  WARNING: This will delete ALL data from the following collections:');
collectionsToClean.forEach(name => console.log(`   - ${name}`));
console.log('\nThis action cannot be undone!');

// Simple confirmation (you can uncomment this for safety)
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
//   if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
//     rl.close();
//     clearDatabase();
//   } else {
//     console.log('Operation cancelled.');
//     rl.close();
//     process.exit(0);
//   }
// });

// For now, run directly (uncomment the confirmation above for safety)
clearDatabase();