// Migration script to create users table structure in Firestore
// This script ensures the users collection has the proper schema and indexes
// Run with: node scripts/migrateUsersTable.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs, query, where } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

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

// User schema definition based on your UserData interface
const USER_SCHEMA = {
  uid: 'string',           // Firebase Auth UID (Primary Key)
  email: 'string',         // User email address
  displayName: 'string',   // User's display name
  role: 'string',          // User role: 'admin', 'customer', 'delivery', 'sub-admin'
  permissions: 'array',    // Array of permissions for sub-admin (optional)
  phoneNumber: 'string',   // User's phone number (optional)
  createdAt: 'number',     // Timestamp when user was created
  updatedAt: 'number',     // Timestamp when user was last updated
};

// Valid roles in the system
const VALID_ROLES = ['admin', 'customer', 'delivery', 'sub-admin'];

// Default admin user to ensure system has at least one admin
const DEFAULT_ADMIN = {
  email: 'admin@hpgas.com',
  password: 'admin123456',
  displayName: 'System Administrator',
  role: 'admin',
  phoneNumber: '+91-9876543210'
};

/**
 * Create the default admin user if it doesn't exist
 */
async function createDefaultAdmin() {
  console.log('🔧 Checking for default admin user...');
  
  try {
    // Check if admin user already exists in Firestore
    const usersRef = collection(db, 'users');
    const adminQuery = query(usersRef, where('email', '==', DEFAULT_ADMIN.email));
    const adminSnapshot = await getDocs(adminQuery);
    
    if (!adminSnapshot.empty) {
      console.log('✓ Default admin user already exists');
      return adminSnapshot.docs[0].data();
    }
    
    // Try to create admin user in Firebase Auth
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth, 
        DEFAULT_ADMIN.email, 
        DEFAULT_ADMIN.password
      );
      console.log('✓ Created admin user in Firebase Auth');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Admin exists in Auth but not in Firestore, sign in to get UID
        userCredential = await signInWithEmailAndPassword(
          auth, 
          DEFAULT_ADMIN.email, 
          DEFAULT_ADMIN.password
        );
        console.log('✓ Admin user exists in Firebase Auth, signed in');
      } else {
        throw error;
      }
    }
    
    const timestamp = Date.now();
    
    // Create admin user document in Firestore
    const adminUserDoc = {
      uid: userCredential.user.uid,
      email: DEFAULT_ADMIN.email,
      displayName: DEFAULT_ADMIN.displayName,
      role: DEFAULT_ADMIN.role,
      phoneNumber: DEFAULT_ADMIN.phoneNumber,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), adminUserDoc);
    console.log('✓ Created default admin user in Firestore');
    
    return adminUserDoc;
    
  } catch (error) {
    console.error('✗ Error creating default admin:', error.message);
    throw error;
  }
}

/**
 * Validate existing users and fix any schema issues
 */
async function validateAndFixUsers() {
  console.log('\n🔍 Validating existing users...');
  
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      console.log('ℹ️  No existing users found');
      return;
    }
    
    let validUsers = 0;
    let fixedUsers = 0;
    let invalidUsers = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      let needsUpdate = false;
      const updates = {};
      
      console.log(`\n📋 Checking user: ${userData.email || userId}`);
      
      // Validate required fields
      if (!userData.uid) {
        updates.uid = userId;
        needsUpdate = true;
        console.log('  ⚠️  Missing uid, will set to document ID');
      }
      
      if (!userData.email) {
        console.log('  ❌ Missing email - INVALID USER');
        invalidUsers++;
        continue;
      }
      
      if (!userData.displayName) {
        updates.displayName = userData.email.split('@')[0];
        needsUpdate = true;
        console.log('  ⚠️  Missing displayName, will set from email');
      }
      
      // Validate role
      if (!userData.role) {
        updates.role = 'customer';
        needsUpdate = true;
        console.log('  ⚠️  Missing role, will set to "customer"');
      } else if (!VALID_ROLES.includes(userData.role)) {
        updates.role = 'customer';
        needsUpdate = true;
        console.log(`  ⚠️  Invalid role "${userData.role}", will set to "customer"`);
      }
      
      // Validate timestamps
      if (!userData.createdAt) {
        updates.createdAt = Date.now();
        needsUpdate = true;
        console.log('  ⚠️  Missing createdAt, will set to current time');
      }
      
      if (!userData.updatedAt) {
        updates.updatedAt = Date.now();
        needsUpdate = true;
        console.log('  ⚠️  Missing updatedAt, will set to current time');
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        try {
          await setDoc(doc(db, 'users', userId), { ...userData, ...updates }, { merge: true });
          console.log('  ✅ Fixed user schema');
          fixedUsers++;
        } catch (error) {
          console.log(`  ❌ Failed to fix user: ${error.message}`);
          invalidUsers++;
        }
      } else {
        console.log('  ✅ User schema is valid');
        validUsers++;
      }
    }
    
    console.log(`\n📊 User validation summary:`);
    console.log(`   Valid users: ${validUsers}`);
    console.log(`   Fixed users: ${fixedUsers}`);
    console.log(`   Invalid users: ${invalidUsers}`);
    
  } catch (error) {
    console.error('✗ Error validating users:', error.message);
    throw error;
  }
}

/**
 * Display users table schema information
 */
function displaySchema() {
  console.log('\n📋 Users Table Schema:');
  console.log('Collection: users');
  console.log('Document ID: {uid} (Firebase Auth UID)');
  console.log('\nFields:');
  
  Object.entries(USER_SCHEMA).forEach(([field, type]) => {
    const required = ['uid', 'email', 'displayName', 'role', 'createdAt', 'updatedAt'].includes(field);
    const requiredText = required ? '(Required)' : '(Optional)';
    console.log(`  ${field}: ${type} ${requiredText}`);
  });
  
  console.log('\nValid Roles:');
  VALID_ROLES.forEach(role => {
    console.log(`  - ${role}`);
  });
  
  console.log('\nRole-based Access:');
  console.log('  - admin: Full access to all features');
  console.log('  - sub-admin: Limited admin access based on permissions array');
  console.log('  - delivery: Access to delivery management features');
  console.log('  - customer: Access to customer features (default)');
}

/**
 * Main migration function
 */
async function migrateUsersTable() {
  try {
    console.log('🚀 Starting Users Table Migration...\n');
    
    // Display schema information
    displaySchema();
    
    // Create default admin user
    const adminUser = await createDefaultAdmin();
    
    // Validate and fix existing users
    await validateAndFixUsers();
    
    console.log('\n🎉 Users table migration completed successfully!');
    console.log('\n🔑 Default Admin Credentials:');
    console.log(`   Email: ${DEFAULT_ADMIN.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log(`   Role: ${DEFAULT_ADMIN.role}`);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Update Firestore Security Rules to properly handle user roles');
    console.log('2. Test login with different user roles');
    console.log('3. Run the seeding script to create sample users: npm run seed');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateUsersTable();