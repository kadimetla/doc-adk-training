
---
title: Loop Agents
---

## Module 20: Iterative Refinement with Loop Agents

## Overview

### The `LoopAgent`

The `LoopAgent` is a workflow agent that executes its `sub_agents` sequentially, over and over again, until a termination condition is met.

### The Critic -> Refiner Pattern

The most common pattern for a `LoopAgent` is the **Critic -> Refiner** loop:

1.  **Critic Agent:** Evaluates the current state of the work (e.g., an essay draft) and outputs feedback.
2.  **Refiner Agent:** Reads the original work and the critic's feedback, then applies the feedback to create an improved version, overwriting the previous version in the state.
3.  **Repeat:** The loop continues, with the Critic evaluating the newly refined work in the next iteration.

### Terminating a Loop

Every `LoopAgent` MUST have a way to stop:

1.  **`max_iterations` (Safety Net):** A required safeguard to prevent infinite loops.
2.  **Smart Termination (Exit Tool):** A tool that can be called by an agent (usually the Refiner) to signal that the work is complete and the loop should terminate.
