import type { HighlighterCore } from "shiki/core";
import type { LLMUIHighlighter } from "./types.js";

// Starts loading the highlighter immediately, hopefully it loads before it's needed
// we can get the highlighter sync using getHighlighter and async using highlighterPromise
export const loadHighlighter = (
  highlighter: Promise<HighlighterCore>,
): LLMUIHighlighter => {
  let highlighterInstance: HighlighterCore | undefined;
  return {
    getHighlighter: () => highlighterInstance,
    highlighterPromise: highlighter.then((h) => {
      highlighterInstance = h;
      return h;
    }),
  };
};
