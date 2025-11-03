import type { HighlighterCore } from "shiki";
import type { LLMUIHighlighter } from "./types";

/**
 * Load a Shiki highlighter
 * This returns a promise that resolves to the highlighter
 *
 * @example
 * ```typescript
 * import { getHighlighterCore } from 'shiki/core';
 * import { bundledLanguagesInfo } from 'shiki/langs';
 * import { bundledThemes } from 'shiki/themes';
 * import getWasm from 'shiki/wasm';
 *
 * const highlighter = loadHighlighter(
 *   getHighlighterCore({
 *     langs: bundledLanguagesInfo,
 *     themes: Object.values(bundledThemes),
 *     loadWasm: getWasm,
 *   })
 * );
 * ```
 */
export const loadHighlighter = (
  highlighter: Promise<HighlighterCore>,
): LLMUIHighlighter => {
  return highlighter;
};
