import type { BundledLanguage, BundledTheme, HighlighterCore } from "shiki";

export type CodeToHtmlOptions = {
  lang?: BundledLanguage | string;
  theme?: BundledTheme | string;
};

export type LLMUIHighlighter = Promise<HighlighterCore>;

export type ShikiProps = {
  highlighter: LLMUIHighlighter;
  codeToHtmlOptions: CodeToHtmlOptions;
};
