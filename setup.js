#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Password Vault MVP Setup');
console.log('============================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
    console.log('⚠️  Please edit .env with your configuration values\n');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('Please run: npm install\n');
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('🚀 Setup Instructions:');
console.log('1. Edit .env file with your MongoDB URI and secrets');
console.log('2. Start MongoDB: mongod (or start your MongoDB service)');
console.log('3. Start backend: npm run server');
console.log('4. Start frontend: npm run dev');
console.log('5. Open http://localhost:3000 in your browser\n');

console.log('📚 For detailed instructions, see README.md');
