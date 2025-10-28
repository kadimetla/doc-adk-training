
---
title: Evaluation
---

## Module 24: Evaluating Agent Performance

## Overview

### Why Traditional Tests Aren't Enough

`LlmAgent`s are **non-deterministic**. Asking the same question twice might yield slightly different, yet equally correct, answers. This means we need a more sophisticated way to evaluate our agents than simple string comparison.

### Principles of Agent Evaluation

1.  **Evaluating the Final Response:** Assesses the quality of the agent's final answer using criteria like semantic similarity or rubrics.
2.  **Evaluating the Trajectory:** Assesses the agent's reasoning process by checking the sequence of tool calls it made.

### How Evaluation Works in the ADK

The workflow revolves around creating **Evaluation Cases**, which are recordings of a "golden path" conversation. You can create these easily from the ADK Developer UI and then run them automatically from the UI or the command line (`adk eval`) to catch regressions.
