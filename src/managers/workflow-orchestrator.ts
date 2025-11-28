import { z } from 'zod';
import { WorkflowStep, WorkflowOrchestratorInput } from '../types.js';

export interface WorkflowExecutionResult {
  workflowId: string;
  status: 'completed' | 'failed' | 'running' | 'cancelled';
  steps: WorkflowStepResult[];
  overallResult: any;
  executionTime: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface WorkflowStepResult {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  serverName: string;
  toolName: string;
  startedAt?: string;
  completedAt?: string;
  executionTime?: number;
  result?: any;
  error?: string;
  retryCount?: number;
  dependencies?: string[];
}

export class WorkflowOrchestrator {
  private activeWorkflows = new Map<string, WorkflowExecutionResult>();

  async executeWorkflow(input: WorkflowOrchestratorInput): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    const workflowId = input.workflowId;

    // Initialize workflow execution
    const execution: WorkflowExecutionResult = {
      workflowId,
      status: 'running',
      steps: [],
      overallResult: {},
      executionTime: 0,
      startedAt: new Date().toISOString(),
    };

    this.activeWorkflows.set(workflowId, execution);

    try {
      // Build execution plan
      const executionPlan = this.buildExecutionPlan(input.steps);

      // Execute steps in order
      for (const stepGroup of executionPlan) {
        const stepPromises = stepGroup.map(step => this.executeStep(step, input, execution));
        await Promise.all(stepPromises);
      }

      // Check if all steps completed successfully
      const allCompleted = execution.steps.every(step => step.status === 'completed');
      const anyFailed = execution.steps.some(step => step.status === 'failed');

      if (allCompleted && !anyFailed) {
        execution.status = 'completed';
        execution.overallResult = this.aggregateResults(execution.steps);
      } else {
        execution.status = 'failed';
        execution.error = 'One or more workflow steps failed';
      }

    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error during workflow execution';
    } finally {
      execution.executionTime = Date.now() - startTime;
      execution.completedAt = new Date().toISOString();
      this.activeWorkflows.set(workflowId, execution);
    }

    return execution;
  }

  private buildExecutionPlan(steps: WorkflowStep[]): WorkflowStep[][] {
    const executed = new Set<string>();
    const inProgress = new Set<string>();
    const result: WorkflowStep[][] = [];

    while (executed.size < steps.length) {
      const currentBatch: WorkflowStep[] = [];

      for (const step of steps) {
        if (executed.has(step.id) || inProgress.has(step.id)) {
          continue;
        }

        // Check if all dependencies are satisfied
        const dependenciesSatisfied = !step.dependsOn ||
          step.dependsOn.every(depId => executed.has(depId));

        if (dependenciesSatisfied) {
          currentBatch.push(step);
          inProgress.add(step.id);
        }
      }

      if (currentBatch.length === 0) {
        // No steps can be executed - likely circular dependency
        throw new Error('Circular dependency detected or unsatisfied dependencies in workflow');
      }

      result.push(currentBatch);

      // Mark batch as executed
      currentBatch.forEach(step => {
        executed.add(step.id);
        inProgress.delete(step.id);
      });
    }

    return result;
  }

  private async executeStep(
    step: WorkflowStep,
    workflow: WorkflowOrchestratorInput,
    execution: WorkflowExecutionResult
  ): Promise<void> {
    const stepResult: WorkflowStepResult = {
      stepId: step.id,
      status: 'running',
      serverName: step.serverName,
      toolName: step.toolName,
      startedAt: new Date().toISOString(),
      dependencies: step.dependsOn,
    };

    execution.steps.push(stepResult);

    try {
      // Resolve parameters with variable substitution and output mapping
      const resolvedParams = this.resolveParameters(step, execution.steps, workflow.variables);

      // Execute the tool (this is a placeholder - in reality, this would call the MCP server)
      const result = await this.callMCPServerTool(step.serverName, step.toolName, resolvedParams);

      stepResult.status = 'completed';
      stepResult.result = result;
      stepResult.completedAt = new Date().toISOString();
      stepResult.executionTime = stepResult.completedAt && stepResult.startedAt
        ? new Date(stepResult.completedAt).getTime() - new Date(stepResult.startedAt).getTime()
        : 0;

    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error instanceof Error ? error.message : 'Unknown error';
      stepResult.completedAt = new Date().toISOString();

      // Handle retries if configured
      if (step.retryOnFailure && (!step.maxRetries || (stepResult.retryCount || 0) < step.maxRetries)) {
        stepResult.retryCount = (stepResult.retryCount || 0) + 1;
        // In a real implementation, you'd retry the step here
      }

      // If failFast is enabled, this would stop the entire workflow
      if (workflow.failFast) {
        throw error;
      }
    }
  }

  private resolveParameters(
    step: WorkflowStep,
    completedSteps: WorkflowStepResult[],
    globalVariables?: Record<string, any>
  ): Record<string, any> {
    const resolved = { ...step.parameters };

    // Substitute global variables
    if (globalVariables) {
      Object.keys(resolved).forEach(key => {
        if (typeof resolved[key] === 'string' && resolved[key].startsWith('$')) {
          const varName = resolved[key].substring(1);
          if (globalVariables[varName] !== undefined) {
            resolved[key] = globalVariables[varName];
          }
        }
      });
    }

    // Apply output mapping from dependent steps
    if (step.outputMapping) {
      Object.entries(step.outputMapping).forEach(([paramName, outputPath]) => {
        const [stepId, outputKey] = outputPath.split('.');
        const sourceStep = completedSteps.find(s => s.stepId === stepId);

        if (sourceStep && sourceStep.result && sourceStep.result[outputKey] !== undefined) {
          resolved[paramName] = sourceStep.result[outputKey];
        }
      });
    }

    return resolved;
  }

  private async callMCPServerTool(
    serverName: string,
    toolName: string,
    parameters: Record<string, any>
  ): Promise<any> {
    // This is a placeholder implementation
    // In a real implementation, this would:
    // 1. Find the MCP server by name
    // 2. Establish connection to the server
    // 3. Call the tool with the provided parameters
    // 4. Return the result

    console.log(`Executing ${toolName} on ${serverName} with parameters:`, parameters);

    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    // Mock response based on tool type
    if (toolName === 'google_search') {
      return {
        searchInfo: { totalResults: '1000000', searchTime: 0.5 },
        items: [
          {
            title: `Search result for ${parameters.q}`,
            link: `https://example.com/${parameters.q.replace(/\s+/g, '-')}`,
            snippet: `This is a search result snippet for ${parameters.q}...`,
          }
        ]
      };
    }

    if (toolName === 'initialize_memory') {
      return { message: 'Memory system initialized successfully' };
    }

    // Generic success response
    return {
      success: true,
      message: `${toolName} executed successfully on ${serverName}`,
      parameters: parameters,
      timestamp: new Date().toISOString(),
    };
  }

  private aggregateResults(steps: WorkflowStepResult[]): any {
    const aggregated: any = {};

    // Aggregate results by step
    steps.forEach(step => {
      if (step.result) {
        aggregated[step.stepId] = step.result;
      }
    });

    // Create summary
    aggregated.summary = {
      totalSteps: steps.length,
      completedSteps: steps.filter(s => s.status === 'completed').length,
      failedSteps: steps.filter(s => s.status === 'failed').length,
      totalExecutionTime: steps.reduce((sum, s) => sum + (s.executionTime || 0), 0),
    };

    return aggregated;
  }

  getWorkflowStatus(workflowId: string): WorkflowExecutionResult | null {
    return this.activeWorkflows.get(workflowId) || null;
  }

  cancelWorkflow(workflowId: string): boolean {
    const workflow = this.activeWorkflows.get(workflowId);
    if (workflow && workflow.status === 'running') {
      workflow.status = 'cancelled';
      workflow.completedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  getActiveWorkflows(): string[] {
    return Array.from(this.activeWorkflows.keys()).filter(id => {
      const workflow = this.activeWorkflows.get(id);
      return workflow && workflow.status === 'running';
    });
  }
}
