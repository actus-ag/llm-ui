import type { LLMOutputMatcher } from "@llm-ui/svelte";
import type { CodeBlockOptions } from "./options.js";
import { getOptions } from "./options.js";
import { regexMatcher } from "./regexMatcher.js";
import { getStartEndGroup } from "./shared.js";

export const findCompleteCodeBlock = (
  userOptions?: Partial<CodeBlockOptions>,
): LLMOutputMatcher => {
  const options = getOptions(userOptions);
  const startEndGroup = getStartEndGroup(options.startEndChars);
  const regex = new RegExp(
    `${startEndGroup}.*\n([\\s\\S]*?)\n${startEndGroup}`,
  );
  return regexMatcher(regex);
};

export const findPartialCodeBlock = (
  userOptions?: Partial<CodeBlockOptions>,
): LLMOutputMatcher => {
  const options = getOptions(userOptions);
  const regex = new RegExp(
    `(${options.startEndChars.map((char) => `${char}{1,2}$|${char}{3}`).join("|")})[\\s\\S]*`,
  );
  return regexMatcher(regex);
};
