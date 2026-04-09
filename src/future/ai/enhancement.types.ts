export interface EnhancementInput {
  title: string;
  description?: string | null;
}

export interface EnhancementSuggestion {
  summary: string;
  prompts: string[];
}

