import { JsonBlockOptionsComplete } from "./options";

export const removeStartEndChars = (
  str: string,
  options: JsonBlockOptionsComplete,
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

export const regexMatcherGlobal = (regex: RegExp) => {
  return (llmOutput: string) => {
    const matches = [];
    let match;
    while ((match = regex.exec(llmOutput)) !== null) {
      matches.push({
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        outputRaw: match[0],
      });
    }
    return matches;
  };
};
