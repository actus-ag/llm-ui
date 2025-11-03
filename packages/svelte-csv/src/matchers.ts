import type { LLMOutputMatcher } from "@actus-ag/llm-ui-svelte";
import { CsvBlockOptions, getOptions } from "./options";
import { escapeRegexChars, regexMatcher } from "./shared";

export const findCompleteCsvBlock = (
  options: CsvBlockOptions,
): LLMOutputMatcher => {
  const { type, startChar, endChar, delimiter } = getOptions(options);
  const { escapedStart, escapedEnd } = escapeRegexChars(startChar, endChar);

  const regex = new RegExp(
    `${escapedStart}${type}${delimiter}([\\s\\S]*?)${escapedEnd}`,
  );
  return regexMatcher(regex);
};

export const findPartialCsvBlock = (
  options: CsvBlockOptions,
): LLMOutputMatcher => {
  const { type, startChar, delimiter } = getOptions(options);
  const { escapedStart } = escapeRegexChars(startChar);

  const regex = new RegExp(`${escapedStart}${type}${delimiter}([\\s\\S]*)`);
  return regexMatcher(regex);
};
