#!/usr/bin/env node

import { spawn } from 'child_process';

// Test the initialize request
const testInitialize = () => {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
      console.log('STDOUT:', data.toString());
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('STDERR:', data.toString());
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Send initialize request
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };

    setTimeout(() => {
      server.stdin.write(JSON.stringify(initRequest) + '\n');

      // Wait for response and then close
      setTimeout(() => {
        server.kill();
        resolve({ output, errorOutput });
      }, 2000);
    }, 100);
  });
};

testInitialize()
  .then(result => {
    console.log('Test completed');
    console.log('Output length:', result.output.length);
    console.log('Error output length:', result.errorOutput.length);

    // Check if we got a valid JSON response
    try {
      const lines = result.output.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.startsWith('{')) {
          const response = JSON.parse(line);
          console.log('Valid JSON response:', JSON.stringify(response, null, 2));
          break;
        }
      }
    } catch (error) {
      console.log('No valid JSON response found');
    }
  })
  .catch(error => {
    console.error('Test failed:', error);
  });
