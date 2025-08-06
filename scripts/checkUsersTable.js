// Script to check the current state of the users table in Firestore
// This script displays all users and their roles for debugging
// Run with: node scripts/checkUsersTable.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

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

/**
 * Get all users from Firestore
 */
async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

/**
 * Get users by role
 */
async function getUsersByRole(role) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting users with role ${role}:`, error);
    return [];
  }
}

/**
 * Display user information in a formatted table
 */
function displayUsers(users, title = 'Users') {
  console.log(`\n📋 ${title} (${users.length} found):`);
  
  if (users.length === 0) {
    console.log('   No users found');
    return;
  }
  
  console.log('   ┌─────────────────────────────────────────────────────────────────────────────────┐');
  console.log('   │ Email                    │ Role        │ Display Name        │ Phone           │');
  console.log('   ├─────────────────────────────────────────────────────────────────────────────────┤');
  
  users.forEach(user => {
    const email = (user.email || 'N/A').padEnd(24);
    const role = (user.role || 'N/A').padEnd(11);
    const displayName = (user.displayName || 'N/A').padEnd(19);
    const phone = (user.phoneNumber || 'N/A').padEnd(15);
    
    console.log(`   │ ${email} │ ${role} │ ${displayName} │ ${phone} │`);
  });
  
  console.log('   └─────────────────────────────────────────────────────────────────────────────────┘');
}

/**
 * Display detailed user information
 */
function displayUserDetails(users) {
  console.log('\n🔍 Detailed User Information:');
  
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. User Details:`);
    console.log(`   UID: ${user.uid || user.id}`);
    console.log(`   Email: ${user.email || 'N/A'}`);
    console.log(`   Display Name: ${user.displayName || 'N/A'}`);
    console.log(`   Role: ${user.role || 'N/A'}`);
    console.log(`   Phone: ${user.phoneNumber || 'N/A'}`);
    
    if (user.permissions && user.permissions.length > 0) {
      console.log(`   Permissions: ${user.permissions.join(', ')}`);
    }
    
    if (user.createdAt) {
      const createdDate = new Date(user.createdAt).toLocaleString();
      console.log(`   Created: ${createdDate}`);
    }
    
    if (user.updatedAt) {
      const updatedDate = new Date(user.updatedAt).toLocaleString();
      console.log(`   Updated: ${updatedDate}`);
    }
  });
}

/**
 * Generate statistics about users
 */
function generateStatistics(users) {
  const stats = {
    total: users.length,
    byRole: {},
    withPermissions: 0,
    withPhone: 0,
    missingFields: {
      uid: 0,
      email: 0,
      displayName: 0,
      role: 0,
      createdAt: 0,
      updatedAt: 0
    }
  };
  
  users.forEach(user => {
    // Count by role
    const role = user.role || 'undefined';
    stats.byRole[role] = (stats.byRole[role] || 0) + 1;
    
    // Count users with permissions
    if (user.permissions && user.permissions.length > 0) {
      stats.withPermissions++;
    }
    
    // Count users with phone numbers
    if (user.phoneNumber) {
      stats.withPhone++;
    }
    
    // Count missing fields
    Object.keys(stats.missingFields).forEach(field => {
      if (!user[field]) {
        stats.missingFields[field]++;
      }
    });
  });
  
  return stats;
}

/**
 * Display statistics
 */
function displayStatistics(stats) {
  console.log('\n📊 User Statistics:');
  console.log(`   Total Users: ${stats.total}`);
  
  console.log('\n   Users by Role:');
  Object.entries(stats.byRole).forEach(([role, count]) => {
    console.log(`     ${role}: ${count}`);
  });
  
  console.log(`\n   Users with Permissions: ${stats.withPermissions}`);
  console.log(`   Users with Phone Numbers: ${stats.withPhone}`);
  
  const missingFieldsCount = Object.values(stats.missingFields).reduce((sum, count) => sum + count, 0);
  if (missingFieldsCount > 0) {
    console.log('\n   ⚠️  Missing Fields:');
    Object.entries(stats.missingFields).forEach(([field, count]) => {
      if (count > 0) {
        console.log(`     ${field}: ${count} users`);
      }
    });
  }
}

/**
 * Main function to check users table
 */
async function checkUsersTable() {
  try {
    console.log('🔍 Checking Users Table in Firestore...\n');
    
    // Get all users
    const allUsers = await getAllUsers();
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in the database!');
      console.log('\n💡 Suggestions:');
      console.log('1. Run the migration script: node scripts/migrateUsersTable.js');
      console.log('2. Run the seeding script: npm run seed');
      process.exit(0);
    }
    
    // Display all users
    displayUsers(allUsers, 'All Users');
    
    // Display users by role
    const roles = ['admin', 'customer', 'delivery', 'sub-admin'];
    for (const role of roles) {
      const roleUsers = await getUsersByRole(role);
      if (roleUsers.length > 0) {
        displayUsers(roleUsers, `${role.charAt(0).toUpperCase() + role.slice(1)} Users`);
      }
    }
    
    // Generate and display statistics
    const stats = generateStatistics(allUsers);
    displayStatistics(stats);
    
    // Display detailed information if requested
    if (process.argv.includes('--detailed') || process.argv.includes('-d')) {
      displayUserDetails(allUsers);
    }
    
    console.log('\n✅ Users table check completed!');
    console.log('\n💡 Tips:');
    console.log('   - Use --detailed or -d flag for detailed user information');
    console.log('   - Run migration script if you see missing fields');
    console.log('   - Check Firestore security rules if you see permission errors');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error checking users table:', error);
    process.exit(1);
  }
}

// Run the check
checkUsersTable();