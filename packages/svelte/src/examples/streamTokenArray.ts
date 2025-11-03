import { writable } from "svelte/store";
import type {
  StreamState,
  TokenWithDelay,
  UseStreamTokenArrayOptions,
} from "./types";

export const streamTokenArrayDefaultOptions: UseStreamTokenArrayOptions = {
  autoStart: true,
  autoStartDelayMs: 500,
  startIndex: 0,
  delayMultiplier: 1,
};

export const createStreamTokenArray = (
  tokensWithDelay: TokenWithDelay[],
  userOptions: Partial<UseStreamTokenArrayOptions> = {},
) => {
  const options = { ...streamTokenArrayDefaultOptions, ...userOptions };

  const state = writable<StreamState>({
    output: "",
    isStreamStarted: false,
    isStreamFinished: false,
    isPlaying: false,
  });

  let timeoutRef: ReturnType<typeof setTimeout> | undefined;
  let currentIndex = options.startIndex;

  const reset = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRef = undefined;
    }
    currentIndex = options.startIndex;
    state.set({
      output: "",
      isStreamStarted: false,
      isStreamFinished: false,
      isPlaying: false,
    });
  };

  const pause = () => {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRef = undefined;
    }
    state.update((s) => ({ ...s, isPlaying: false }));
  };

  const streamNext = () => {
    if (currentIndex >= tokensWithDelay.length) {
      state.update((s) => ({
        ...s,
        isStreamFinished: true,
        isPlaying: false,
      }));
      return;
    }

    const { token } = tokensWithDelay[currentIndex];
    state.update((s) => ({
      ...s,
      output: s.output + token,
      isStreamStarted: true,
      isPlaying: true,
    }));

    currentIndex++;

    if (currentIndex < tokensWithDelay.length) {
      const nextDelay =
        tokensWithDelay[currentIndex].delayMs * options.delayMultiplier;
      timeoutRef = setTimeout(streamNext, nextDelay);
    } else {
      state.update((s) => ({
        ...s,
        isStreamFinished: true,
        isPlaying: false,
      }));
    }
  };

  const start = () => {
    let currentState: StreamState = {
      output: "",
      isStreamStarted: false,
      isStreamFinished: false,
      isPlaying: false,
    };
    const unsubscribe = state.subscribe((s) => (currentState = s));
    unsubscribe();

    if (currentState.isStreamFinished || currentState.isPlaying) {
      return;
    }

    streamNext();
  };

  if (options.autoStart) {
    setTimeout(start, options.autoStartDelayMs);
  }

  return {
    subscribe: state.subscribe,
    reset,
    pause,
    start,
  };
};

export type StreamTokenArray = ReturnType<typeof createStreamTokenArray>;
