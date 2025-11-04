import { writable } from "svelte/store";
import { throttleBasic } from "../throttle";
import { matchBlocks } from "./helper";
import type {
  BlockMatch,
  LLMOutputBlock,
  LLMOutputFallbackBlock,
  ThrottleFunction,
} from "./types";

export type LLMOutputOptions = {
  llmOutput: string;
  blocks?: LLMOutputBlock[];
  fallbackBlock: LLMOutputFallbackBlock;
  isStreamFinished: boolean;
  throttle?: ThrottleFunction;
  onFinish?: () => void;
};

export type LLMOutputState = {
  blockMatches: BlockMatch[];
  isFinished: boolean;
  finishCount: number;
  visibleText: string;
};

const matchesToVisibleText = (matches: BlockMatch[]): string => {
  return matches.map((match) => match.visibleText).join("");
};

const matchesToOutput = (matches: BlockMatch[]): string => {
  return matches.map((match) => match.output).join("");
};

const initialState: LLMOutputState = {
  blockMatches: [],
  isFinished: false,
  visibleText: "",
  finishCount: 0,
};

export const createLLMOutput = (options: LLMOutputOptions) => {
  const {
    llmOutput,
    isStreamFinished,
    blocks = [],
    fallbackBlock,
    throttle = throttleBasic(),
    onFinish = () => null,
  } = options;

  const state = writable<LLMOutputState>({
    ...initialState,
    blockMatches: matchBlocks({
      llmOutput,
      blocks,
      fallbackBlock,
      isStreamFinished,
    }),
  });

  let startTime = performance.now();
  let frameRef: number | undefined;
  let frameCount = 0;
  let finishTime: DOMHighResTimeStamp | undefined;
  let previousFrameTime: DOMHighResTimeStamp | undefined;
  let visibleTextAllLengths: number[] = [];
  let outputLengths: number[] = [];
  let visibleTextIncrements: number[] = [];
  let visibleTextLengthTarget = 0;

  let currentLLMOutput = llmOutput;
  let currentIsStreamFinished = isStreamFinished;
  let currentBlocks = blocks;
  let currentFallbackBlock = fallbackBlock;
  let currentThrottle = throttle;

  const reset = () => {
    state.set({ ...initialState, finishCount: 0, blockMatches: [] });
    startTime = performance.now();
    finishTime = undefined;
    previousFrameTime = undefined;
    visibleTextAllLengths = [];
    outputLengths = [];
    visibleTextIncrements = [];
    visibleTextLengthTarget = 0;
    frameCount = 0;
    if (frameRef) {
      cancelAnimationFrame(frameRef);
      frameRef = undefined;
    }
  };

  const restart = () => {
    reset();
    setTimeout(() => {
      if (!frameRef) {
        frameRef = requestAnimationFrame(renderLoop);
      }
    }, 10);
  };

  const renderLoop = (frameTime: DOMHighResTimeStamp) => {
    let currentState: LLMOutputState = initialState;
    const unsubscribe = state.subscribe((s) => (currentState = s));
    unsubscribe();

    const allMatches = matchBlocks({
      llmOutput: currentLLMOutput,
      blocks: currentBlocks,
      fallbackBlock: currentFallbackBlock,
      isStreamFinished: currentIsStreamFinished,
    });

    const visibleText = matchesToVisibleText(currentState.blockMatches);
    const outputRendered = matchesToOutput(currentState.blockMatches);

    const visibleTextAll = matchesToVisibleText(allMatches);
    const outputAll = matchesToOutput(allMatches);

    if (!currentIsStreamFinished) {
      visibleTextAllLengths.push(visibleTextAll.length);
      outputLengths.push(outputAll.length);
    }

    const isFinished =
      visibleText === visibleTextAll && currentIsStreamFinished;
    if (isFinished) {
      frameRef = undefined;
      state.update((s) => ({
        ...s,
        blockMatches: currentState.blockMatches,
        isFinished,
        finishCount: s.finishCount + 1,
        visibleText,
      }));
      onFinish();
      return;
    }

    const visibleTextLengthsAll = currentIsStreamFinished
      ? [...visibleTextAllLengths, visibleTextAll.length]
      : visibleTextAllLengths;

    const outputLengthsAll = currentIsStreamFinished
      ? [...outputLengths, outputAll.length]
      : outputLengths;

    const { visibleTextIncrement } = currentThrottle({
      outputRaw: currentLLMOutput,
      outputRendered,
      outputAll,
      visibleText,
      visibleTextAll,
      startStreamTime: startTime,
      isStreamFinished: currentIsStreamFinished,
      frameCount,
      frameTime,
      frameTimePrevious: previousFrameTime,
      finishStreamTime: finishTime,
      visibleTextLengthsAll,
      outputLengths: outputLengthsAll,
      visibleTextIncrements,
      visibleTextLengthTarget,
    });

    if (visibleTextIncrement < 0) {
      throw new Error("throttle returned negative visibleTextIncrement");
    }

    visibleTextIncrements.push(visibleTextIncrement);
    visibleTextLengthTarget = visibleTextLengthTarget + visibleTextIncrement;

    if (visibleTextLengthTarget > visibleText.length) {
      const matches = matchBlocks({
        llmOutput: currentLLMOutput,
        blocks: currentBlocks,
        fallbackBlock: currentFallbackBlock,
        isStreamFinished: currentIsStreamFinished,
        visibleTextLengthTarget,
      });
      const updatedVisibleText = matchesToVisibleText(matches);

      state.update((s) => ({
        ...s,
        blockMatches: matches,
        isFinished,
        visibleText: updatedVisibleText,
      }));
    }

    frameRef = requestAnimationFrame(renderLoop);
    previousFrameTime = frameTime;
    frameCount = frameCount + 1;
  };

  const start = () => {
    if (!frameRef && currentLLMOutput && currentLLMOutput.length > 0) {
      frameRef = requestAnimationFrame(renderLoop);
    }
  };

  const stop = () => {
    if (frameRef) {
      cancelAnimationFrame(frameRef);
      frameRef = undefined;
    }
  };

  const update = (newOptions: Partial<LLMOutputOptions>) => {
    if (newOptions.llmOutput !== undefined) {
      const hadOutput = currentLLMOutput.length > 0;
      currentLLMOutput = newOptions.llmOutput;

      if (visibleTextIncrements.length > 0 && currentLLMOutput.length === 0) {
        reset();
      } else if (!hadOutput && currentLLMOutput.length > 0) {
        start();
      }
    }
    if (newOptions.isStreamFinished !== undefined) {
      if (!finishTime && newOptions.isStreamFinished) {
        finishTime = performance.now();
      }
      currentIsStreamFinished = newOptions.isStreamFinished;
    }
    if (newOptions.blocks !== undefined) {
      currentBlocks = newOptions.blocks;
    }
    if (newOptions.fallbackBlock !== undefined) {
      currentFallbackBlock = newOptions.fallbackBlock;
    }
    if (newOptions.throttle !== undefined) {
      currentThrottle = newOptions.throttle;
    }
  };

  return {
    subscribe: state.subscribe,
    restart,
    start,
    stop,
    update,
  };
};

export type LLMOutput = ReturnType<typeof createLLMOutput>;
