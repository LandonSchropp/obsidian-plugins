import { ExtractionSettings } from "./types";

// TODO: In the future, these constants could be swapped with a settings UI. However, this is good
// enough for now.
export const EXTRACTIONS: ExtractionSettings[] = [
  {
    name: "Thought",
    icon: "leaf",
    template: "Templates/Thought.md",
    fileName: "Resources/Thoughts/{{date}} - Thought",
  },
  {
    name: "Idea",
    icon: "lightbulb",
    template: "Templates/Idea.md",
    fileName: "Resources/Ideas/{{date}} - Idea",
  },
];
