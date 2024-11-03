import { ExtractionSettings } from "./types";

// TODO: In the future, these constants could be swapped with a settings UI. However, this is good
// enough for now.
export const EXTRACTIONS: ExtractionSettings[] = [
  {
    name: "Thought",
    icon: "leaf",
    template: "Templates/Thoughts/Thought.md",
    fileName: "Resources/Thoughts/{{date}} - Thought",
  },
  {
    name: "Idea",
    icon: "lightbulb",
    template: "Templates/Thoughts/Idea.md",
    fileName: "Resources/Ideas/{{date}} - Idea",
  },
  {
    name: "Question",
    icon: "question-mark-glyph",
    template: "Templates/Thoughts/Question.md",
    fileName: "Resources/Questions/{{date}} - Question",
  },
];
