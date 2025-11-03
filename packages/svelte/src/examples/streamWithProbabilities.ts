import { stringToTokenArray } from "./helper";
import {
  createStreamTokenArray,
  streamTokenArrayDefaultOptions,
} from "./streamTokenArray";
import type { UseStreamWithProbabilitiesOptions } from "./types";

export const streamWithProbabilitiesDefaultOptions: UseStreamWithProbabilitiesOptions =
  {
    ...streamTokenArrayDefaultOptions,
    tokenCharsProbabilities: [
      { tokenChars: 1, prob: 0.8 },
      { tokenChars: 2, prob: 0.15 },
      { tokenChars: 3, prob: 0.05 },
    ],
    delayMsProbabilities: [
      { delayMs: 10, prob: 0.3 },
      { delayMs: 20, prob: 0.3 },
      { delayMs: 30, prob: 0.2 },
      { delayMs: 50, prob: 0.1 },
      { delayMs: 100, prob: 0.05 },
      { delayMs: 200, prob: 0.03 },
      { delayMs: 500, prob: 0.02 },
    ],
  };

export const createStreamWithProbabilities = (
  llmOutput: string,
  userOptions: Partial<UseStreamWithProbabilitiesOptions> = {},
) => {
  const options = {
    ...streamWithProbabilitiesDefaultOptions,
    ...userOptions,
  };

  const tokensWithDelay = stringToTokenArray(llmOutput, {
    tokenCharsProbabilities: options.tokenCharsProbabilities,
    delayMsProbabilities: options.delayMsProbabilities,
  });

  return createStreamTokenArray(tokensWithDelay, options);
};

export const createStreamExample = createStreamWithProbabilities;
