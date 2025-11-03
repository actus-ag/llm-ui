import type { ParseFunction } from "./parse";
import { parseCompleteMarkdownCodeBlock } from "./parse";
import type { CodeToHtmlOptions, LLMUIHighlighter } from "./types";

export type CodeBlockToHtmlParams = {
  markdownCodeBlock: string;
  highlighter: LLMUIHighlighter;
  codeToHtmlOptions: CodeToHtmlOptions;
  parser?: ParseFunction;
};

export type CodeBlockToHtmlReturn = {
  html: string | undefined;
  code: string;
};

/**
 * Convert a markdown code block to HTML with syntax highlighting
 * This is a framework-agnostic function that can be used in Svelte stores
 */
export const codeBlockToHtml = async ({
  markdownCodeBlock,
  highlighter,
  codeToHtmlOptions,
  parser = parseCompleteMarkdownCodeBlock,
}: CodeBlockToHtmlParams): Promise<CodeBlockToHtmlReturn> => {
  const { code = "\n", language } = parser(markdownCodeBlock);
  const lang = codeToHtmlOptions.lang ?? language ?? "plain";

  try {
    const shiki = await highlighter;
    const html = shiki.codeToHtml(code, {
      lang,
      theme: codeToHtmlOptions.theme ?? "github-dark",
    });
    return { html, code };
  } catch (error) {
    // If highlighter not ready or error, return undefined
    return { html: undefined, code };
  }
};

export type CodeToHtmlParams = {
  code: string;
  highlighter: LLMUIHighlighter;
  codeToHtmlOptions: CodeToHtmlOptions;
};

/**
 * Convert code to HTML with syntax highlighting
 * This is a framework-agnostic function that can be used in Svelte stores
 */
export const codeToHtml = async ({
  code,
  highlighter,
  codeToHtmlOptions,
}: CodeToHtmlParams): Promise<string | undefined> => {
  try {
    const shiki = await highlighter;
    const html = shiki.codeToHtml(code, {
      lang: codeToHtmlOptions.lang ?? "plain",
      theme: codeToHtmlOptions.theme ?? "github-dark",
    });
    return html;
  } catch (error) {
    return undefined;
  }
};
