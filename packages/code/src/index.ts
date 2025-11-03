export { findCompleteCodeBlock, findPartialCodeBlock } from "./matchers";

export { defaultOptions as defaultCodeBlockOptions } from "./options";
export type { CodeBlockOptions } from "./options";

export {
  parseCompleteMarkdownCodeBlock,
  parsePartialMarkdownCodeBlock,
} from "./parse";
export type { CodeBlock, ParseFunction } from "./parse";

export { codeBlockLookBack } from "./lookBack";

export { codeBlockToHtml, codeToHtml } from "./codeToHtml";
export type {
  CodeBlockToHtmlParams,
  CodeBlockToHtmlReturn,
  CodeToHtmlParams,
} from "./codeToHtml";

export { loadHighlighter } from "./loadHighlighter";

export type { CodeToHtmlOptions, LLMUIHighlighter, ShikiProps } from "./types";
