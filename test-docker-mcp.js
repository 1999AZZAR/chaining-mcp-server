#!/usr/bin/env node

/**
 * Test script to verify Docker MCP configuration
 * This script simulates how Cursor would call the MCP server via Docker
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration from mcp.json
const dockerArgs = [
  'run',
  '-i',
  '--rm',
  '-v',
  `${__dirname}/data:/app/data`,
  '-v',
  '/home/azzar/.cursor/mcp.json:/home/mcpuser/.cursor/mcp.json:ro',
  'chaining-mcp-server'
];

const env = {
  NODE_ENV: 'production',
  MEMORY_FILE_PATH: '/app/data/memory.json',
  SEQUENTIAL_THINKING_AVAILABLE: 'true'
};

console.log('Testing Docker MCP Configuration...');
console.log('Command:', 'docker', dockerArgs.join(' '));
console.log('Environment:', env);
console.log('');

// Test MCP handshake
const testMessage = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {}
    },
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

console.log('Sending test message:', JSON.stringify(testMessage, null, 2));
console.log('');

// Spawn Docker container
const dockerProcess = spawn('docker', dockerArgs, {
  env: { ...process.env, ...env },
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

dockerProcess.stdout.on('data', (data) => {
  output += data.toString();
  console.log('STDOUT:', data.toString().trim());
});

dockerProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('STDERR:', data.toString().trim());
});

dockerProcess.on('close', (code) => {
  console.log('');
  console.log(`Process exited with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Docker MCP configuration test PASSED');
  } else {
    console.log('❌ Docker MCP configuration test FAILED');
    console.log('Error output:', errorOutput);
  }
});

dockerProcess.on('error', (error) => {
  console.log('❌ Failed to start Docker process:', error.message);
  console.log('');
  console.log('Troubleshooting tips:');
  console.log('1. Make sure Docker is running: docker ps');
  console.log('2. Build the image first: docker build -t chaining-mcp-server .');
  console.log('3. Check if the image exists: docker images | grep chaining-mcp-server');
});

// Send test message and close stdin
setTimeout(() => {
  dockerProcess.stdin.write(JSON.stringify(testMessage) + '\n');
  dockerProcess.stdin.end();
}, 1000);

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timed out after 10 seconds');
  dockerProcess.kill();
}, 10000);
