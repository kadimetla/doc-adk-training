
---
title: Parallel Workflows
---

## Module 18: Parallel Processing with ParallelAgent

## Overview

### `ParallelAgent`: Concurrent Execution

The `ParallelAgent` is a workflow agent that executes all of its `sub_agents` at the same time (concurrently). This is a powerful pattern for improving performance when your workflow involves multiple independent tasks.

**Key Concepts:**
*   **Execution Order:** Not guaranteed. The agents run in parallel.
*   **Shared State:** All sub-agents share the same session state.
*   **Avoiding Conflicts:** Ensure that sub-agents write their results to *different* keys in the state to avoid overwriting each other's work.

### The Fan-Out/Gather Pattern

A common and highly effective architecture is the **fan-out/gather** pattern:

1.  **Fan-Out (`ParallelAgent`):** A `ParallelAgent` runs multiple data-gathering agents concurrently (e.g., searching for flights, hotels, and activities).
2.  **Gather (`SequentialAgent`):** A final `LlmAgent` runs *after* the parallel step, reading all the results from the state and synthesizing them into a single, coherent response.
