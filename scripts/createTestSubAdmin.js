// Script to create a test sub-admin user
// Run this script to create a test sub-admin user for testing purposes

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

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
const auth = getAuth(app);

async function createTestSubAdmin() {
  try {
    const email = 'subadmin@test.com';
    const password = 'testpassword123';
    const displayName = 'Test Sub Admin';
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Created Firebase Auth user:', user.uid);
    
    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: 'sub-admin',
      permissions: ['orders', 'products'], // Give some test permissions
      phoneNumber: '+1234567890',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log('Created sub-admin user successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Permissions:', userData.permissions);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sub-admin user:', error);
    process.exit(1);
  }
}

// Run the script
createTestSubAdmin();