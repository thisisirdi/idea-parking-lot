import type { EnhancementInput, EnhancementSuggestion } from "./enhancement.types";

export interface EnhancementService {
  enhanceIdea(input: EnhancementInput): Promise<EnhancementSuggestion>;
}
