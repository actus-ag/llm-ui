import type { ShikiProps } from "./types.js";

export type CodeToHtmlParams = {
  code: string;
} & ShikiProps;

export const codeToHtml = async ({
  code,
  highlighter,
  codeToHtmlOptions,
}: CodeToHtmlParams): Promise<string> => {
  const shikiHighlighter = await highlighter.highlighterPromise;
  if (!shikiHighlighter) {
    return "";
  }
  return shikiHighlighter.codeToHtml(code, {
    ...codeToHtmlOptions,
    lang: codeToHtmlOptions.lang ?? "plain",
  });
};
