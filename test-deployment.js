// Simple test script to verify the server can start
import { spawn } from 'child_process';

console.log('Testing server deployment...');

// Test 1: Check if dist/index.js exists
try {
  const fs = await import('fs');
  if (fs.existsSync('./dist/index.js')) {
    console.log('✅ dist/index.js exists');
  } else {
    console.log('❌ dist/index.js not found');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Cannot check dist/index.js:', error.message);
  process.exit(1);
}

// Test 2: Try to start the server briefly
const child = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  timeout: 5000
});

let output = '';
child.stdout.on('data', (data) => {
  output += data.toString();
});

child.stderr.on('data', (data) => {
  console.log('Server output:', data.toString());
});

child.on('close', (code) => {
  if (code === 0 || output.includes('Chaining MCP Server started')) {
    console.log('✅ Server starts successfully');
  } else {
    console.log('❌ Server failed to start, code:', code);
  }
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.log('❌ Failed to start server:', error.message);
  process.exit(1);
});
