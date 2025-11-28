import { z } from 'zod';
import { BrainstormingInput } from '../types.js';

export interface BrainstormIdea {
  id: string;
  content: string;
  category: string;
  feasibility: number; // 1-10 scale
  innovation: number; // 1-10 scale
  effort: number; // 1-10 scale (lower is better)
  pros: string[];
  cons: string[];
  relatedIdeas?: string[];
}

export interface BrainstormResult {
  topic: string;
  approach: string;
  ideas: BrainstormIdea[];
  evaluation?: {
    topIdeas: BrainstormIdea[];
    recommendedApproach: string;
    considerations: string[];
  };
  timestamp: string;
  metadata: {
    totalIdeas: number;
    approach: string;
    constraints: string[];
  };
}

export class BrainstormingManager {
  private readonly CREATIVE_IDEAS = {
    'problem-solving': [
      'Think outside the box - what unconventional solutions exist?',
      'Reverse the problem - what if the opposite were true?',
      'Combine unrelated concepts from different domains',
      'Remove constraints - what if budget/time/resources were unlimited?',
      'Scale it down - what\'s the minimal viable solution?',
      'Scale it up - what if this problem was 100x bigger?',
      'Change perspective - how would a child/artist/engineer approach this?',
      'Use analogies - what similar problems have been solved before?',
    ],
    'product-development': [
      'What user needs are we not addressing?',
      'How can we simplify the user journey?',
      'What features can we remove without losing value?',
      'How can we make this more accessible/intuitive?',
      'What would delight our users unexpectedly?',
      'How can we integrate with existing user workflows?',
      'What would make this indispensable to users?',
      'How can we create network effects or virality?',
    ],
    'innovation': [
      'What emerging technologies could disrupt this space?',
      'How can AI/machine learning enhance this?',
      'What partnerships could create new value?',
      'How can we gamify this experience?',
      'What subscription or recurring revenue models work?',
      'How can we create platform effects?',
      'What adjacent markets can we enter?',
      'How can we leverage user-generated content?',
    ],
  };

  private readonly ANALYTICAL_IDEAS = {
    'data-driven': [
      'What metrics indicate success and how can we measure them?',
      'What data do we have vs. what do we need?',
      'How can A/B testing validate our assumptions?',
      'What are the key performance indicators?',
      'How can we segment users for better targeting?',
      'What predictive analytics can guide decisions?',
      'How can we optimize conversion funnels?',
      'What cohort analysis reveals about user behavior?',
    ],
    'process-optimization': [
      'What bottlenecks exist in the current process?',
      'How can we automate repetitive tasks?',
      'What parallel processing can speed things up?',
      'How can we reduce handoffs between teams?',
      'What standardization can improve quality?',
      'How can we implement continuous improvement?',
      'What feedback loops can drive iteration?',
      'How can we measure and reduce waste?',
    ],
  };

  private readonly PRACTICAL_IDEAS = {
    'implementation': [
      'What are the quickest wins we can achieve?',
      'What existing tools/resources can we leverage?',
      'How can we prototype this rapidly?',
      'What MVPs can validate our assumptions?',
      'How can we reduce technical debt?',
      'What incremental improvements can compound?',
      'How can we ensure scalability from day one?',
      'What security/privacy considerations are critical?',
    ],
    'business': [
      'What revenue streams are most reliable?',
      'How can we reduce customer acquisition cost?',
      'What partnerships reduce risk and cost?',
      'How can we improve unit economics?',
      'What pricing strategies maximize value?',
      'How can we increase customer lifetime value?',
      'What competitive advantages can we build?',
      'How can we create switching costs?',
    ],
  };

  async generateIdeas(input: BrainstormingInput): Promise<BrainstormResult> {
    const { topic, context = '', approach, ideaCount, includeEvaluation, constraints = [] } = input;

    // Generate ideas based on approach
    const ideas = this.generateIdeasForApproach(topic, context, approach, ideaCount, constraints);

    // Evaluate ideas if requested
    let evaluation: BrainstormResult['evaluation'];
    if (includeEvaluation) {
      evaluation = this.evaluateIdeas(ideas, topic, constraints);
    }

    return {
      topic,
      approach,
      ideas,
      evaluation,
      timestamp: new Date().toISOString(),
      metadata: {
        totalIdeas: ideas.length,
        approach,
        constraints,
      },
    };
  }

  private generateIdeasForApproach(
    topic: string,
    context: string,
    approach: string,
    count: number,
    constraints: string[]
  ): BrainstormIdea[] {
    const ideas: BrainstormIdea[] = [];
    const usedIdeas = new Set<string>();

    // Get approach-specific idea templates
    let templates: string[] = [];

    switch (approach) {
      case 'creative':
        templates = [
          ...this.CREATIVE_IDEAS['problem-solving'],
          ...this.CREATIVE_IDEAS['product-development'],
          ...this.CREATIVE_IDEAS['innovation'],
        ];
        break;
      case 'analytical':
        templates = [
          ...this.ANALYTICAL_IDEAS['data-driven'],
          ...this.ANALYTICAL_IDEAS['process-optimization'],
        ];
        break;
      case 'practical':
        templates = [
          ...this.PRACTICAL_IDEAS['implementation'],
          ...this.PRACTICAL_IDEAS['business'],
        ];
        break;
      case 'innovative':
        templates = [
          ...this.CREATIVE_IDEAS['innovation'],
          ...this.ANALYTICAL_IDEAS['data-driven'],
          ...this.PRACTICAL_IDEAS['implementation'],
        ];
        break;
    }

    // Generate ideas by adapting templates to the topic
    for (let i = 0; i < count && ideas.length < count; i++) {
      const template = templates[i % templates.length];
      const idea = this.adaptTemplateToTopic(template, topic, context, constraints);

      if (!usedIdeas.has(idea.content)) {
        usedIdeas.add(idea.content);
        ideas.push(idea);
      }
    }

    return ideas;
  }

  private adaptTemplateToTopic(
    template: string,
    topic: string,
    context: string,
    constraints: string[]
  ): BrainstormIdea {
    // Simple template adaptation - in a real implementation, this could use more sophisticated NLP
    let content = template;

    // Replace generic terms with topic-specific ones
    const topicWords = topic.toLowerCase().split(' ');
    const mainTopic = topicWords[0] || 'solution';

    content = content.replace(/this/g, mainTopic);
    content = content.replace(/problem/g, topic.toLowerCase());
    content = content.replace(/solution/g, `${mainTopic} solution`);
    content = content.replace(/product/g, mainTopic);
    content = content.replace(/service/g, mainTopic);

    // Add context if provided
    if (context) {
      content += ` (considering: ${context})`;
    }

    // Consider constraints in the idea
    const constraintText = constraints.length > 0
      ? ` while addressing: ${constraints.join(', ')}`
      : '';

    content += constraintText;

    // Generate evaluation metrics
    const feasibility = Math.floor(Math.random() * 5) + 6; // 6-10
    const innovation = Math.floor(Math.random() * 8) + 3; // 3-10
    const effort = Math.floor(Math.random() * 7) + 2; // 2-8

    // Generate pros and cons based on metrics
    const pros = this.generatePros(feasibility, innovation, effort);
    const cons = this.generateCons(feasibility, innovation, effort);

    return {
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      category: this.categorizeIdea(content),
      feasibility,
      innovation,
      effort,
      pros,
      cons,
    };
  }

  private categorizeIdea(content: string): string {
    const categories = ['Technical', 'Business', 'User Experience', 'Process', 'Innovation', 'Strategic'];

    // Simple categorization based on keywords
    if (content.toLowerCase().includes('user') || content.toLowerCase().includes('interface')) {
      return 'User Experience';
    }
    if (content.toLowerCase().includes('revenue') || content.toLowerCase().includes('cost') || content.toLowerCase().includes('business')) {
      return 'Business';
    }
    if (content.toLowerCase().includes('code') || content.toLowerCase().includes('technical') || content.toLowerCase().includes('api')) {
      return 'Technical';
    }
    if (content.toLowerCase().includes('process') || content.toLowerCase().includes('workflow')) {
      return 'Process';
    }
    if (content.toLowerCase().includes('innovative') || content.toLowerCase().includes('disrupt')) {
      return 'Innovation';
    }

    return categories[Math.floor(Math.random() * categories.length)];
  }

  private generatePros(feasibility: number, innovation: number, effort: number): string[] {
    const pros: string[] = [];

    if (feasibility >= 8) pros.push('Highly feasible with current resources');
    if (innovation >= 7) pros.push('Highly innovative approach');
    if (effort <= 4) pros.push('Low implementation effort');
    if (feasibility >= 6 && innovation >= 6) pros.push('Good balance of practicality and creativity');
    if (effort <= 6) pros.push('Can be implemented quickly');

    // Add 1-2 random pros
    const additionalPros = [
      'Scalable solution',
      'Cost-effective',
      'User-friendly',
      'Maintainable',
      'Future-proof',
    ];

    const shuffled = additionalPros.sort(() => 0.5 - Math.random());
    pros.push(...shuffled.slice(0, Math.floor(Math.random() * 2) + 1));

    return pros.slice(0, 3); // Max 3 pros
  }

  private generateCons(feasibility: number, innovation: number, effort: number): string[] {
    const cons: string[] = [];

    if (feasibility <= 5) cons.push('May require significant resources');
    if (innovation >= 8) cons.push('High risk due to innovative nature');
    if (effort >= 7) cons.push('High implementation effort required');
    if (feasibility <= 6) cons.push('May face technical challenges');
    if (innovation <= 4) cons.push('May not differentiate sufficiently');

    // Add 0-2 random cons
    const additionalCons = [
      'Learning curve for team',
      'Potential compatibility issues',
      'May require additional tools/training',
      'Timeline could be extended',
    ];

    const shuffled = additionalCons.sort(() => 0.5 - Math.random());
    cons.push(...shuffled.slice(0, Math.floor(Math.random() * 2)));

    return cons.slice(0, 3); // Max 3 cons
  }

  private evaluateIdeas(ideas: BrainstormIdea[], topic: string, constraints: string[]): BrainstormResult['evaluation'] {
    // Sort ideas by a composite score (feasibility * 0.4 + innovation * 0.3 + (11-effort) * 0.3)
    const scoredIdeas = ideas.map(idea => ({
      ...idea,
      score: (idea.feasibility * 0.4) + (idea.innovation * 0.3) + ((11 - idea.effort) * 0.3),
    }));

    scoredIdeas.sort((a, b) => b.score - a.score);
    const topIdeas = scoredIdeas.slice(0, 3);

    // Generate considerations based on constraints and topic
    const considerations: string[] = [];

    if (constraints.length > 0) {
      considerations.push(`Addresses constraints: ${constraints.join(', ')}`);
    }

    considerations.push(`Top ideas span ${new Set(topIdeas.map(i => i.category)).size} different categories`);
    considerations.push('Consider combining complementary ideas for best results');

    const recommendedApproach = topIdeas[0]?.content.substring(0, 100) + '...' || 'Evaluate top ideas further';

    return {
      topIdeas,
      recommendedApproach,
      considerations,
    };
  }
}
