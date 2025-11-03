export { findCompleteCodeBlock, findPartialCodeBlock } from "./matchers.js";

export { defaultOptions as defaultCodeBlockOptions } from "./options.js";
export type { CodeBlockOptions } from "./options.js";

export {
  parseCompleteMarkdownCodeBlock,
  parsePartialMarkdownCodeBlock,
} from "./parse.js";
export type { CodeBlock, ParseFunction } from "./parse.js";

export { codeBlockLookBack } from "./lookBack.js";

export { codeBlockToHtml } from "./codeBlockToHtml.js";
export type {
  CodeBlockToHtmlParams,
  CodeBlockToHtmlReturn,
} from "./codeBlockToHtml.js";

export { codeToHtml } from "./codeToHtml.js";
export type { CodeToHtmlParams } from "./codeToHtml.js";

export { loadHighlighter } from "./loadHighlighter.js";

export type {
  CodeToHtmlOptions,
  LLMUIHighlighter,
  ShikiProps,
} from "./types.js";

export { allLangs, allLangsAlias } from "./shikiBundles/allLangs.js";
