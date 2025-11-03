import { codeToHtml } from "./codeToHtml.js";
import type { ParseFunction } from "./parse.js";
import { parseCompleteMarkdownCodeBlock } from "./parse.js";
import type { ShikiProps } from "./types.js";

export type CodeBlockToHtmlParams = {
  markdownCodeBlock: string;
  parser?: ParseFunction;
} & ShikiProps;

export type CodeBlockToHtmlReturn = {
  html: string | undefined;
  code: string;
};

export const codeBlockToHtml = async ({
  markdownCodeBlock,
  highlighter,
  codeToHtmlOptions,
  parser = parseCompleteMarkdownCodeBlock,
}: CodeBlockToHtmlParams): Promise<CodeBlockToHtmlReturn> => {
  const { code = "\n", language } = parser(markdownCodeBlock);
  const lang = codeToHtmlOptions.lang ?? language ?? "plain";
  const html = await codeToHtml({
    code,
    highlighter,
    codeToHtmlOptions: { ...codeToHtmlOptions, lang },
  });
  return { html, code };
};
