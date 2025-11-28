import chalk from 'chalk';

export interface ThoughtData {
  thought: string;
  thoughtNumber: number;
  totalThoughts: number;
  isRevision?: boolean;
  revisesThought?: number;
  branchFromThought?: number;
  branchId?: string;
  needsMoreThoughts?: boolean;
  nextThoughtNeeded: boolean;
}

export class SequentialThinkingManager {
  private thoughtHistory: ThoughtData[] = [];
  private branches: Record<string, ThoughtData[]> = {};
  private disableThoughtLogging: boolean;

  constructor() {
    this.disableThoughtLogging = (process.env.DISABLE_THOUGHT_LOGGING || "").toLowerCase() === "true";
  }

  private validateThoughtData(input: unknown): ThoughtData {
    const data = input as Record<string, unknown>;

    if (!data.thought || typeof data.thought !== 'string') {
      throw new Error('Invalid thought: must be a non-empty string');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number' || data.thoughtNumber < 1) {
      throw new Error('Invalid thoughtNumber: must be a positive number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number' || data.totalThoughts < 1) {
      throw new Error('Invalid totalThoughts: must be a positive number');
    }
    if (typeof data.nextThoughtNeeded !== 'boolean') {
      throw new Error('Invalid nextThoughtNeeded: must be a boolean');
    }

    // Validate optional fields
    if (data.isRevision !== undefined && typeof data.isRevision !== 'boolean') {
      throw new Error('Invalid isRevision: must be a boolean');
    }
    if (data.revisesThought !== undefined && (typeof data.revisesThought !== 'number' || data.revisesThought < 1)) {
      throw new Error('Invalid revisesThought: must be a positive number');
    }
    if (data.branchFromThought !== undefined && (typeof data.branchFromThought !== 'number' || data.branchFromThought < 1)) {
      throw new Error('Invalid branchFromThought: must be a positive number');
    }
    if (data.branchId !== undefined && typeof data.branchId !== 'string') {
      throw new Error('Invalid branchId: must be a string');
    }
    if (data.needsMoreThoughts !== undefined && typeof data.needsMoreThoughts !== 'boolean') {
      throw new Error('Invalid needsMoreThoughts: must be a boolean');
    }

    return {
      thought: data.thought,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      nextThoughtNeeded: data.nextThoughtNeeded,
      isRevision: data.isRevision as boolean | undefined,
      revisesThought: data.revisesThought as number | undefined,
      branchFromThought: data.branchFromThought as number | undefined,
      branchId: data.branchId as string | undefined,
      needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
    };
  }

  private formatThought(thoughtData: ThoughtData): string {
    const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId } = thoughtData;

    let prefix = '';
    let context = '';

    if (isRevision) {
      prefix = chalk.yellow('🔄 Revision');
      context = ` (revising thought ${revisesThought})`;
    } else if (branchFromThought) {
      prefix = chalk.green('🌿 Branch');
      context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
    } else {
      prefix = chalk.blue('💭 Thought');
      context = '';
    }

    const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
    const border = '─'.repeat(Math.max(header.length, thought.length) + 4);

    return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`;
  }

  public processThought(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateThoughtData(input);

      if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
        validatedInput.totalThoughts = validatedInput.thoughtNumber;
      }

      this.thoughtHistory.push(validatedInput);

      if (validatedInput.branchFromThought && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      if (!this.disableThoughtLogging) {
        const formattedThought = this.formatThought(validatedInput);
        console.error(formattedThought);
      }

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            thoughtNumber: validatedInput.thoughtNumber,
            totalThoughts: validatedInput.totalThoughts,
            nextThoughtNeeded: validatedInput.nextThoughtNeeded,
            branches: Object.keys(this.branches),
            thoughtHistoryLength: this.thoughtHistory.length
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }

  /**
   * Get the current thought history
   */
  public getThoughtHistory(): ThoughtData[] {
    return [...this.thoughtHistory];
  }

  /**
   * Get all branches
   */
  public getBranches(): Record<string, ThoughtData[]> {
    return { ...this.branches };
  }

  /**
   * Clear all thought history and branches
   */
  public clearHistory(): void {
    this.thoughtHistory = [];
    this.branches = {};
  }

  /**
   * Get statistics about the thinking session
   */
  public getStatistics(): {
    totalThoughts: number;
    totalBranches: number;
    revisions: number;
    averageThoughtLength: number;
  } {
    const revisions = this.thoughtHistory.filter(t => t.isRevision).length;
    const totalLength = this.thoughtHistory.reduce((sum, t) => sum + t.thought.length, 0);
    
    return {
      totalThoughts: this.thoughtHistory.length,
      totalBranches: Object.keys(this.branches).length,
      revisions,
      averageThoughtLength: this.thoughtHistory.length > 0 ? totalLength / this.thoughtHistory.length : 0,
    };
  }
}
