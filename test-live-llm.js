#!/usr/bin/env node

/**
 * Live test script for Chaining MCP Server with OpenRouter LLM.
 */

import { LLMManager } from './dist/managers/llm-manager.js';
import { MCPServerDiscovery } from './dist/core/discovery.js';
import { SmartRouteOptimizer } from './dist/core/optimizer.js';
import { SequentialThinkingIntegration } from './dist/integrations/sequential-integration.js';
import { SequentialThinkingManager } from './dist/managers/sequential-thinking-manager.js';
import { TimeManager } from './dist/managers/time-manager.js';
import { PromptRegistry } from './dist/prompts/prompt-registry.js';
import { AwesomeCopilotIntegration } from './dist/integrations/awesome-copilot-integration.js';
import { BrainstormingManager } from './dist/managers/brainstorming-manager.js';
import { WorkflowOrchestrator } from './dist/managers/workflow-orchestrator.js';
import { RequestHandlers } from './dist/handlers/request-handlers.js';
import { ResourceHandlers } from './dist/resources/resource-handlers.js';

async function testLiveLLM() {
  console.log('🤖 Testing Chaining MCP with Live OpenRouter LLM...');
  
  process.env.CHAINING_LLM_ENABLED = 'true';
  const llmManager = new LLMManager();

  console.log('LLM Manager Status:', llmManager.getStatus());

  if (!llmManager.isEnabled()) {
    console.error('❌ LLM is not enabled or API key is missing.');
    process.exit(1);
  }

  const discovery = new MCPServerDiscovery();
  const optimizer = new SmartRouteOptimizer();
  const sequentialIntegration = new SequentialThinkingIntegration();
  const sequentialThinkingManager = new SequentialThinkingManager();
  const timeManager = new TimeManager();
  const promptRegistry = new PromptRegistry();
  const awesomeCopilotIntegration = new AwesomeCopilotIntegration();
  const brainstormingManager = new BrainstormingManager();
  const workflowOrchestrator = new WorkflowOrchestrator();

  await discovery.discoverServers();
  await discovery.analyzeTools();
  optimizer.setTools(discovery.getTools());
  sequentialIntegration.setAvailableTools(discovery.getTools());

  const requestHandlers = new RequestHandlers(
    discovery,
    optimizer,
    sequentialIntegration,
    sequentialThinkingManager,
    timeManager,
    promptRegistry,
    awesomeCopilotIntegration,
    brainstormingManager,
    workflowOrchestrator,
    llmManager
  );

  const resourceHandlers = new ResourceHandlers(
    discovery,
    promptRegistry,
    awesomeCopilotIntegration,
    sequentialThinkingManager,
    workflowOrchestrator,
    llmManager
  );

  // 1. Test llm_query
  console.log('\n--- 1. Testing llm_query ---');
  const t0 = Date.now();
  const queryRes = await requestHandlers.handleToolCall('llm_query', {
    prompt: 'State in one short sentence what an MCP tool chain is.'
  });
  console.log(`Response (${Date.now() - t0}ms):`, queryRes);

  // 2. Test llm_decompose_task
  console.log('\n--- 2. Testing llm_decompose_task ---');
  const t1 = Date.now();
  const decompRes = await requestHandlers.handleToolCall('llm_decompose_task', {
    task: 'Fetch user data from Postgres and generate a PDF report'
  });
  console.log(`Response (${Date.now() - t1}ms):`, decompRes);

  // 3. Test llm_suggest_route
  console.log('\n--- 3. Testing llm_suggest_route ---');
  const t2 = Date.now();
  const routeRes = await requestHandlers.handleToolCall('llm_suggest_route', {
    task: 'Build and deploy a static documentation site'
  });
  console.log(`Response (${Date.now() - t2}ms):`, routeRes);

  // 4. Test llm_summarize
  console.log('\n--- 4. Testing llm_summarize ---');
  const t3 = Date.now();
  const summaryRes = await requestHandlers.handleToolCall('llm_summarize', {
    content: 'Error: Connection reset by peer at TCP.connect (/node:net:123). Server attempted reconnection 3 times before entering degraded mode. All subsequent healthchecks failed on port 5432.',
    maxWords: 15
  });
  console.log(`Response (${Date.now() - t3}ms):`, summaryRes);

  // 5. Test resources
  console.log('\n--- 5. Testing LLM Resources ---');
  const statusRes = await resourceHandlers.handleReadResource('chaining://llm/status');
  console.log('Status Resource:', statusRes);

  const usageRes = await resourceHandlers.handleReadResource('chaining://llm/usage');
  console.log('Usage Resource:', usageRes);

  console.log('\n✅ All Live LLM tests completed successfully!');
}

testLiveLLM().catch(err => {
  console.error('❌ Live LLM test failed:', err);
  process.exit(1);
});
