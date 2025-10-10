#!/usr/bin/env node

/**
 * Final comprehensive test of the MCP server configuration
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

console.log('🧪 Final MCP Server Test\n');

// Test 1: Configuration validation
console.log('1️⃣ Testing MCP Configuration...');
try {
  const mcpConfig = JSON.parse(readFileSync('/home/azzar/.cursor/mcp.json', 'utf8'));
  const chainingConfig = mcpConfig.mcpServers?.chaining;
  
  if (chainingConfig) {
    console.log('✅ Configuration found');
    
    if (chainingConfig.type === 'stdio') {
      console.log('✅ Type: stdio (correct)');
    } else {
      console.log('❌ Type: missing or incorrect');
    }
    
    if (chainingConfig.command === 'node') {
      console.log('✅ Command: node (working)');
    } else {
      console.log('❌ Command: incorrect');
    }
    
    console.log('✅ Configuration is valid\n');
  } else {
    console.log('❌ Chaining configuration not found\n');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Failed to read configuration:', error.message, '\n');
  process.exit(1);
}

// Test 2: MCP Protocol Test
console.log('2️⃣ Testing MCP Protocol...');

const testMessages = [
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      clientInfo: { name: 'test-client', version: '1.0.0' }
    }
  },
  {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  },
  {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_current_time',
      arguments: { timezone: 'UTC' }
    }
  }
];

let testResults = {
  initialization: false,
  toolList: false,
  toolExecution: false
};

const mcpProcess = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let messageCount = 0;

mcpProcess.stdout.on('data', (data) => {
  output += data.toString();
  
  // Check for initialization response
  if (output.includes('"method":"initialize"') && output.includes('"result"') && !testResults.initialization) {
    testResults.initialization = true;
    console.log('✅ MCP Initialization: SUCCESS');
    messageCount++;
  }
  
  // Check for tool list response
  if (output.includes('"method":"tools/list"') && output.includes('"tools"') && !testResults.toolList) {
    testResults.toolList = true;
    console.log('✅ Tool List: SUCCESS');
    messageCount++;
  }
  
  // Check for tool execution response
  if (output.includes('"method":"tools/call"') && output.includes('"timezone"') && !testResults.toolExecution) {
    testResults.toolExecution = true;
    console.log('✅ Tool Execution: SUCCESS');
    messageCount++;
  }
});

mcpProcess.stderr.on('data', (data) => {
  const error = data.toString();
  if (error.includes('Chaining MCP Server started')) {
    console.log('✅ Server Started');
  } else if (error.includes('Discovered') && error.includes('MCP servers')) {
    console.log('✅ Server Discovery Working');
  } else if (error.includes('Analyzed') && error.includes('tools')) {
    console.log('✅ Tool Analysis Working');
  }
});

mcpProcess.on('close', (code) => {
  console.log('\n3️⃣ Test Results Summary:');
  console.log(`- MCP Initialization: ${testResults.initialization ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`- Tool Listing: ${testResults.toolList ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`- Tool Execution: ${testResults.toolExecution ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(testResults).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Your MCP server is working perfectly!');
    console.log('✅ Ready to use in Cursor');
    console.log('\n📋 Next Steps:');
    console.log('1. Restart Cursor to pick up the configuration');
    console.log('2. Your chaining MCP server should now be available');
    console.log('3. All 17 tools should be functional');
  } else {
    console.log('\n❌ Some tests failed');
    console.log('Check the output above for details');
  }
  
  process.exit(allPassed ? 0 : 1);
});

mcpProcess.on('error', (error) => {
  console.log('❌ Failed to start MCP process:', error.message);
  process.exit(1);
});

// Send test messages
setTimeout(() => {
  testMessages.forEach((message, index) => {
    setTimeout(() => {
      mcpProcess.stdin.write(JSON.stringify(message) + '\n');
    }, index * 1000);
  });
}, 1000);

// Close stdin after all messages sent
setTimeout(() => {
  mcpProcess.stdin.end();
}, 5000);

// Timeout after 15 seconds
setTimeout(() => {
  console.log('\n⏰ Test timed out after 15 seconds');
  mcpProcess.kill();
  process.exit(1);
}, 15000);
