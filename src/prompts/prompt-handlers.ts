/**
 * Prompt Handlers for Chaining MCP Server
 *
 * Handles dynamic prompt generation and processing logic
 */

import { PrebuiltPrompt, ResourceSet } from './prompt-definitions.js';

/**
 * Prompt handlers for dynamic prompt generation and processing
 */
export class PromptHandlers {
  /**
   * Generate a customized prompt based on context (future enhancement)
   */
  generateCustomPrompt(basePrompt: PrebuiltPrompt, context?: Record<string, any>): PrebuiltPrompt {
    // For now, return the base prompt as-is
    // Future enhancements could customize prompts based on context
    return basePrompt;
  }

  /**
   * Validate prompt data integrity
   */
  validatePrompt(prompt: PrebuiltPrompt): boolean {
    return !!(
      prompt.id &&
      prompt.name &&
      prompt.description &&
      prompt.category &&
      prompt.prompt &&
      ['low', 'medium', 'high'].includes(prompt.complexity)
    );
  }

  /**
   * Validate resource set data integrity
   */
  validateResourceSet(resourceSet: ResourceSet): boolean {
    return !!(
      resourceSet.id &&
      resourceSet.name &&
      resourceSet.description &&
      resourceSet.category &&
      resourceSet.resources &&
      resourceSet.resources.length > 0 &&
      ['low', 'medium', 'high'].includes(resourceSet.complexity)
    );
  }

  /**
   * Get prompt metadata for display purposes
   */
  getPromptMetadata(prompt: PrebuiltPrompt): {
    id: string;
    name: string;
    category: string;
    complexity: string;
    tags: string[];
    hasExpectedTools: boolean;
  } {
    return {
      id: prompt.id,
      name: prompt.name,
      category: prompt.category,
      complexity: prompt.complexity,
      tags: prompt.tags,
      hasExpectedTools: !!prompt.expectedTools?.length
    };
  }

  /**
   * Get resource set metadata for display purposes
   */
  getResourceSetMetadata(resourceSet: ResourceSet): {
    id: string;
    name: string;
    category: string;
    complexity: string;
    tags: string[];
    resourceCount: number;
  } {
    return {
      id: resourceSet.id,
      name: resourceSet.name,
      category: resourceSet.category,
      complexity: resourceSet.complexity,
      tags: resourceSet.tags,
      resourceCount: resourceSet.resources.length
    };
  }
}
