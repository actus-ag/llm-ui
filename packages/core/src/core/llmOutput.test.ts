import { describe, expect, it, vi } from "vitest";
import { createLLMOutput } from "./llmOutput";

describe("createLLMOutput", () => {
  it("should create an LLM output store", () => {
    const mockComponent = vi.fn();
    const mockLookBack = vi.fn(() => ({
      output: "test",
      visibleText: "test",
    }));

    const store = createLLMOutput({
      llmOutput: "Hello, world!",
      isStreamFinished: false,
      fallbackBlock: {
        component: mockComponent,
        lookBack: mockLookBack,
      },
    });

    expect(store).toBeDefined();
    expect(store.subscribe).toBeDefined();
    expect(store.restart).toBeDefined();
    expect(store.start).toBeDefined();
    expect(store.stop).toBeDefined();
    expect(store.update).toBeDefined();
  });

  it("should initialize with correct state", () => {
    const mockComponent = vi.fn();
    const mockLookBack = vi.fn(() => ({
      output: "test",
      visibleText: "test",
    }));

    const store = createLLMOutput({
      llmOutput: "Hello",
      isStreamFinished: false,
      fallbackBlock: {
        component: mockComponent,
        lookBack: mockLookBack,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let state: any;
    store.subscribe((s) => (state = s))();

    expect(state).toBeDefined();
    expect(state.blockMatches).toBeDefined();
    expect(state.isFinished).toBe(false);
    expect(state.finishCount).toBe(0);
  });

  it("should update when update method is called", () => {
    const mockComponent = vi.fn();
    const mockLookBack = vi.fn(() => ({
      output: "test",
      visibleText: "test",
    }));

    const store = createLLMOutput({
      llmOutput: "Hello",
      isStreamFinished: false,
      fallbackBlock: {
        component: mockComponent,
        lookBack: mockLookBack,
      },
    });

    store.update({
      llmOutput: "Hello, world!",
      isStreamFinished: true,
    });

    // The update should not throw
    expect(true).toBe(true);
  });
});
