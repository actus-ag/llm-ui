import { CsvBlockOptionsComplete } from "./options";

export const removeStartEndChars = (
  str: string,
  options: CsvBlockOptionsComplete,
): string => {
  const { startChar, endChar } = options;
  let result = str;
  if (result.startsWith(startChar)) {
    result = result.slice(startChar.length);
  }
  if (result.endsWith(endChar)) {
    result = result.slice(0, -endChar.length);
  }
  return result;
};

export const regexMatcher = (regex: RegExp) => {
  return (llmOutput: string) => {
    const match = regex.exec(llmOutput);
    if (!match) {
      return undefined;
    }
    return {
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      outputRaw: match[0],
    };
  };
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const escapeRegexChars = (
  startChar: string,
  endChar?: string,
): { escapedStart: string; escapedEnd?: string } => {
  return {
    escapedStart: escapeRegex(startChar),
    escapedEnd: endChar ? escapeRegex(endChar) : undefined,
  };
};
