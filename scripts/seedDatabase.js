// Database seeding script for HP Gas App
// This script creates sample data for users (admin, customer, delivery) and products
// Run with: node scripts/seedDatabase.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, connectFirestoreEmulator } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');

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

// Sample Users Data
const sampleUsers = [
  {
    email: 'admin@hpgas.com',
    password: 'admin123456',
    displayName: 'HP Gas Admin',
    role: 'admin',
    phoneNumber: '+91-9876543210'
  },
  {
    email: 'customer1@example.com',
    password: 'customer123',
    displayName: 'John Doe',
    role: 'customer',
    phoneNumber: '+91-9876543211'
  },
  {
    email: 'customer2@example.com',
    password: 'customer123',
    displayName: 'Jane Smith',
    role: 'customer',
    phoneNumber: '+91-9876543212'
  },
  {
    email: 'delivery1@hpgas.com',
    password: 'delivery123',
    displayName: 'Raj Kumar',
    role: 'delivery',
    phoneNumber: '+91-9876543213'
  },
  {
    email: 'delivery2@hpgas.com',
    password: 'delivery123',
    displayName: 'Amit Singh',
    role: 'delivery',
    phoneNumber: '+91-9876543214'
  },
  {
    email: 'subadmin@hpgas.com',
    password: 'subadmin123',
    displayName: 'Sub Admin',
    role: 'sub-admin',
    phoneNumber: '+91-9876543215',
    permissions: ['orders', 'products', 'delivery']
  }
];

// Sample Products Data
const sampleProducts = [
  {
    name: 'HP Gas Cylinder - 14.2 KG',
    type: 'gas-cylinder',
    weight: 14.2,
    price: 850,
    originalPrice: 900,
    deliveryCharge: 50,
    inStock: true,
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Standard HP Gas Cylinder for domestic use. High quality LPG for cooking needs.'
  },
  {
    name: 'HP Gas Cylinder - 5 KG',
    type: 'gas-cylinder',
    weight: 5,
    price: 450,
    originalPrice: 500,
    deliveryCharge: 30,
    inStock: true,
    quantity: 75,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Compact HP Gas Cylinder perfect for small families and bachelors.'
  },
  {
    name: 'HP Gas Cylinder - 19 KG',
    type: 'gas-cylinder',
    weight: 19,
    price: 1200,
    originalPrice: 1300,
    deliveryCharge: 75,
    inStock: true,
    quantity: 50,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Large HP Gas Cylinder for commercial use and big families.'
  },
  {
    name: 'Gas Stove - 2 Burner',
    type: 'appliance',
    price: 2500,
    originalPrice: 3000,
    deliveryCharge: 100,
    inStock: true,
    quantity: 25,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    description: 'High-quality 2-burner gas stove with auto-ignition feature.'
  },
  {
    name: 'Gas Stove - 3 Burner',
    type: 'appliance',
    price: 4500,
    originalPrice: 5000,
    deliveryCharge: 150,
    inStock: true,
    quantity: 15,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    description: 'Premium 3-burner gas stove with toughened glass top.'
  },
  {
    name: 'Gas Regulator',
    type: 'accessory',
    price: 350,
    originalPrice: 400,
    deliveryCharge: 25,
    inStock: true,
    quantity: 200,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    description: 'ISI certified gas regulator for safe gas connection.'
  },
  {
    name: 'Gas Pipe - 1.5 Meter',
    type: 'accessory',
    price: 150,
    originalPrice: 200,
    deliveryCharge: 20,
    inStock: true,
    quantity: 150,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    description: 'High-quality rubber gas pipe for connecting cylinder to stove.'
  },
  {
    name: 'Gas Lighter',
    type: 'accessory',
    price: 50,
    originalPrice: 75,
    deliveryCharge: 10,
    inStock: true,
    quantity: 300,
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
    description: 'Refillable gas lighter for kitchen use.'
  }
];

// Function to create users
async function createUsers() {
  console.log('Creating sample users...');
  const createdUsers = [];
  
  for (const userData of sampleUsers) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const user = userCredential.user;
      
      const timestamp = Date.now();
      
      // Create user document in Firestore users collection
      const userDoc = {
        uid: user.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      // Add permissions for sub-admin
      if (userData.permissions) {
        userDoc.permissions = userData.permissions;
      }
      
      await setDoc(doc(db, 'users', user.uid), userDoc);
      
      // If it's a delivery agent, also create entry in delivery_agents collection
      if (userData.role === 'delivery') {
        const deliveryAgentDoc = {
          uid: user.uid,
          name: userData.displayName,
          email: userData.email,
          phone: userData.phoneNumber,
          role: 'delivery',
          isActive: true,
          deliveriesThisWeek: Math.floor(Math.random() * 20),
          remainingToday: Math.floor(Math.random() * 5),
          totalAllotted: Math.floor(Math.random() * 50) + 20,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        await setDoc(doc(db, 'delivery_agents', user.uid), deliveryAgentDoc);
      }
      
      createdUsers.push({
        uid: user.uid,
        email: userData.email,
        role: userData.role,
        displayName: userData.displayName
      });
      
      console.log(`✓ Created ${userData.role}: ${userData.email} (UID: ${user.uid})`);
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠ User ${userData.email} already exists, skipping...`);
      } else {
        console.error(`✗ Error creating user ${userData.email}:`, error.message);
      }
    }
  }
  
  return createdUsers;
}

// Function to create products
async function createProducts() {
  console.log('\nCreating sample products...');
  const createdProducts = [];
  
  for (const productData of sampleProducts) {
    try {
      // Add product to Firestore products collection
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      
      createdProducts.push({
        id: docRef.id,
        name: productData.name,
        type: productData.type,
        price: productData.price
      });
      
      console.log(`✓ Created product: ${productData.name} (ID: ${docRef.id})`);
      
    } catch (error) {
      console.error(`✗ Error creating product ${productData.name}:`, error.message);
    }
  }
  
  return createdProducts;
}

// Function to create sample orders (optional)
async function createSampleOrders(users) {
  console.log('\nCreating sample orders...');
  
  const customers = users.filter(user => user.role === 'customer');
  const deliveryAgents = users.filter(user => user.role === 'delivery');
  
  if (customers.length === 0 || deliveryAgents.length === 0) {
    console.log('⚠ No customers or delivery agents found, skipping order creation');
    return;
  }
  
  const sampleOrders = [
    {
      customerId: customers[0].uid,
      customerName: customers[0].displayName,
      customerEmail: customers[0].email,
      items: [
        {
          productId: 'sample-product-1',
          name: 'HP Gas Cylinder - 14.2 KG',
          price: 850,
          quantity: 1
        }
      ],
      totalAmount: 900, // Including delivery charge
      deliveryCharge: 50,
      status: 'pending',
      deliveryAddress: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91-9876543211'
      },
      assignedDeliveryAgent: deliveryAgents[0].uid,
      createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: Date.now() - (2 * 24 * 60 * 60 * 1000)
    },
    {
      customerId: customers[1] ? customers[1].uid : customers[0].uid,
      customerName: customers[1] ? customers[1].displayName : customers[0].displayName,
      customerEmail: customers[1] ? customers[1].email : customers[0].email,
      items: [
        {
          productId: 'sample-product-2',
          name: 'HP Gas Cylinder - 5 KG',
          price: 450,
          quantity: 2
        }
      ],
      totalAmount: 930, // Including delivery charge
      deliveryCharge: 30,
      status: 'delivered',
      deliveryAddress: {
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91-9876543212'
      },
      assignedDeliveryAgent: deliveryAgents[1] ? deliveryAgents[1].uid : deliveryAgents[0].uid,
      createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
      updatedAt: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      deliveredAt: Date.now() - (1 * 24 * 60 * 60 * 1000)
    }
  ];
  
  for (const orderData of sampleOrders) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log(`✓ Created sample order: ${docRef.id}`);
    } catch (error) {
      console.error('✗ Error creating sample order:', error.message);
    }
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Create users
    const createdUsers = await createUsers();
    
    // Create products
    const createdProducts = await createProducts();
    
    // Create sample orders
    await createSampleOrders(createdUsers);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Products created: ${createdProducts.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@hpgas.com / admin123456');
    console.log('   Customer 1: customer1@example.com / customer123');
    console.log('   Customer 2: customer2@example.com / customer123');
    console.log('   Delivery 1: delivery1@hpgas.com / delivery123');
    console.log('   Delivery 2: delivery2@hpgas.com / delivery123');
    console.log('   Sub Admin: subadmin@hpgas.com / subadmin123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();