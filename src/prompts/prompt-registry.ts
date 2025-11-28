/**
 * Prompt Registry for Chaining MCP Server
 *
 * Manages and provides access to prebuilt prompts and resource sets
 */

import { PrebuiltPrompt, ResourceSet, predefinedPrompts, predefinedResourceSets } from './prompt-definitions.js';
import { PromptHandlers } from './prompt-handlers.js';

/**
 * Registry for managing prompts and resource sets
 */
export class PromptRegistry {
  private prompts: Map<string, PrebuiltPrompt> = new Map();
  private resourceSets: Map<string, ResourceSet> = new Map();
  private handlers: PromptHandlers;

  constructor() {
    this.handlers = new PromptHandlers();
    this.initializeRegistry();
  }

  /**
   * Initialize the registry with predefined data
   */
  private initializeRegistry(): void {
    // Initialize prompts
    predefinedPrompts.forEach(prompt => {
      if (this.handlers.validatePrompt(prompt)) {
        this.prompts.set(prompt.id, prompt);
      }
    });

    // Initialize resource sets
    predefinedResourceSets.forEach(resourceSet => {
      if (this.handlers.validateResourceSet(resourceSet)) {
        this.resourceSets.set(resourceSet.id, resourceSet);
      }
    });
  }

  /**
   * Get all available prompts
   */
  getAllPrompts(): PrebuiltPrompt[] {
    return Array.from(this.prompts.values());
  }

  /**
   * Get prompts by category
   */
  getPromptsByCategory(category: string): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt => prompt.category === category);
  }

  /**
   * Get prompts by tags
   */
  getPromptsByTags(tags: string[]): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt =>
      tags.some(tag => prompt.tags.includes(tag))
    );
  }

  /**
   * Get a specific prompt by ID
   */
  getPrompt(id: string): PrebuiltPrompt | undefined {
    return this.prompts.get(id);
  }

  /**
   * Search prompts by query
   */
  searchPrompts(query: string): PrebuiltPrompt[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPrompts().filter(prompt =>
      prompt.name.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.category.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      prompt.useCase.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all resource sets
   */
  getAllResourceSets(): ResourceSet[] {
    return Array.from(this.resourceSets.values());
  }

  /**
   * Get resource sets by category
   */
  getResourceSetsByCategory(category: string): ResourceSet[] {
    return this.getAllResourceSets().filter(set => set.category === category);
  }

  /**
   * Get a specific resource set by ID
   */
  getResourceSet(id: string): ResourceSet | undefined {
    return this.resourceSets.get(id);
  }

  /**
   * Search resource sets by query
   */
  searchResourceSets(query: string): ResourceSet[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllResourceSets().filter(set =>
      set.name.toLowerCase().includes(lowerQuery) ||
      set.description.toLowerCase().includes(lowerQuery) ||
      set.category.toLowerCase().includes(lowerQuery) ||
      set.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get prompts suitable for a specific complexity level
   */
  getPromptsByComplexity(complexity: 'low' | 'medium' | 'high'): PrebuiltPrompt[] {
    return this.getAllPrompts().filter(prompt => prompt.complexity === complexity);
  }

  /**
   * Get resource sets suitable for a specific complexity level
   */
  getResourceSetsByComplexity(complexity: 'low' | 'medium' | 'high'): ResourceSet[] {
    return this.getAllResourceSets().filter(set => set.complexity === complexity);
  }

  /**
   * Get recommended prompts for beginners
   */
  getBeginnerPrompts(): PrebuiltPrompt[] {
    return this.getPromptsByComplexity('low');
  }

  /**
   * Get recommended prompts for experts
   */
  getExpertPrompts(): PrebuiltPrompt[] {
    return this.getPromptsByComplexity('high');
  }

  /**
   * Get prompt metadata for display purposes
   */
  getPromptMetadata(id: string): ReturnType<PromptHandlers['getPromptMetadata']> | undefined {
    const prompt = this.getPrompt(id);
    return prompt ? this.handlers.getPromptMetadata(prompt) : undefined;
  }

  /**
   * Get resource set metadata for display purposes
   */
  getResourceSetMetadata(id: string): ReturnType<PromptHandlers['getResourceSetMetadata']> | undefined {
    const resourceSet = this.getResourceSet(id);
    return resourceSet ? this.handlers.getResourceSetMetadata(resourceSet) : undefined;
  }

  /**
   * Get a comprehensive overview of available resources
   */
  getResourceOverview(): {
    totalPrompts: number;
    totalResourceSets: number;
    categories: {
      prompts: Record<string, number>;
      resourceSets: Record<string, number>;
    };
    complexity: {
      prompts: Record<string, number>;
      resourceSets: Record<string, number>;
    };
  } {
    const prompts = this.getAllPrompts();
    const resourceSets = this.getAllResourceSets();

    const promptCategories = prompts.reduce((acc, prompt) => {
      acc[prompt.category] = (acc[prompt.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resourceSetCategories = resourceSets.reduce((acc, set) => {
      acc[set.category] = (acc[set.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const promptComplexity = prompts.reduce((acc, prompt) => {
      acc[prompt.complexity] = (acc[prompt.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resourceSetComplexity = resourceSets.reduce((acc, set) => {
      acc[set.complexity] = (acc[set.complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPrompts: prompts.length,
      totalResourceSets: resourceSets.length,
      categories: {
        prompts: promptCategories,
        resourceSets: resourceSetCategories,
      },
      complexity: {
        prompts: promptComplexity,
        resourceSets: resourceSetComplexity,
      },
    };
  }

  /**
   * Get the prompt handlers instance for advanced operations
   */
  getHandlers(): PromptHandlers {
    return this.handlers;
  }
}
