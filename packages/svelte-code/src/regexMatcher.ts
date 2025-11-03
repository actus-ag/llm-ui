import type { MaybeLLMOutputMatch } from "@llm-ui/svelte";

const regexMatchToLLmOutputMatch = (
  regexMatch: RegExpMatchArray | null,
): MaybeLLMOutputMatch => {
  if (regexMatch) {
    const matchString = regexMatch[0];
    const startIndex = regexMatch.index!;
    const endIndex = startIndex + matchString.length;
    return {
      startIndex,
      endIndex,
      outputRaw: matchString,
    };
  }
  return undefined;
};

export const regexMatcher =
  (regex: RegExp) =>
  (llmOutput: string): MaybeLLMOutputMatch => {
    if (regex.global) {
      throw new Error("regexMatcher does not support global regexes");
    }
    return regexMatchToLLmOutputMatch(llmOutput.match(regex));
  };
