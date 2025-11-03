import type { LLMOutputMatcher } from "@actus-ag/llm-ui-svelte";
import {
  JsonBlockOptions,
  JsonBlockOptionsComplete,
  getOptions,
} from "./options";
import { parseJson5 } from "./parseJson5";
import { regexMatcherGlobal, removeStartEndChars } from "./shared";

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const findJsonBlock = (
  regex: RegExp,
  options: JsonBlockOptionsComplete,
): LLMOutputMatcher => {
  const { type } = options;
  const matcher = regexMatcherGlobal(regex);
  return (llmOutput: string) => {
    const matches = matcher(llmOutput);
    if (matches.length === 0) {
      return undefined;
    }
    return matches.find((match) => {
      const block = parseJson5(removeStartEndChars(match.outputRaw, options));

      if (!block || block[options.typeKey] !== type) {
        return undefined;
      }
      return match;
    });
  };
};

export const findCompleteJsonBlock = (
  userOptions: JsonBlockOptions,
): LLMOutputMatcher => {
  const options = getOptions(userOptions);
  const { startChar, endChar } = options;
  const escapedStart = escapeRegex(startChar);
  const escapedEnd = escapeRegex(endChar);
  const regex = new RegExp(`${escapedStart}([\\s\\S]*?)${escapedEnd}`, "g");
  return findJsonBlock(regex, options);
};

export const findPartialJsonBlock = (
  userOptions: JsonBlockOptions,
): LLMOutputMatcher => {
  const options = getOptions(userOptions);
  const { startChar } = options;
  const escapedStart = escapeRegex(startChar);
  const regex = new RegExp(`${escapedStart}([\\s\\S]*)`, "g");
  return findJsonBlock(regex, options);
};
