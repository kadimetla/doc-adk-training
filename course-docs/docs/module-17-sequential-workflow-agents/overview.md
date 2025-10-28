
---
title: Sequential Workflows
---

## Module 17: Sequential Workflows - Building Agent Pipelines

## Overview

### `SequentialAgent`: Building Pipelines

The `SequentialAgent` is a **Workflow Agent** (not powered by an LLM) that executes its `sub_agents` one after another, in a fixed order. It's the foundation for creating multi-step pipelines.

**Key Concepts:**
*   **Execution Order:** Guaranteed to be top-to-bottom.
*   **Shared State:** The `SequentialAgent` passes the *same* session state to each sub-agent, allowing data to be passed between steps.
*   **Data Flow with `output_key`:** An agent can define an `output_key` in its configuration. When it finishes, its response is automatically saved to `state['your_key']`. The next agent can then read this value using `{your_key}` in its instruction prompt.
