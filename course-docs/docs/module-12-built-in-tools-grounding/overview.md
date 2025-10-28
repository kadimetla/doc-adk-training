
---
title: Built-in Tools & Grounding
---

## Module 12: Built-in Tools and Grounding

## Overview

### Why Built-in Tools Matter

Built-in tools allow models to **ground** their responses in current web data, overcoming knowledge cutoff dates.

**Key Advantages**:
*   **Current Information:** Access to up-to-date web content.
*   **No Local Execution:** Tools run inside the model's environment.
*   **Automatic Integration:** The LLM seamlessly incorporates search results.

### `google_search`: Web Grounding

The `google_search` tool allows a Gemini 2.0+ model to search the web to find information.

### The `GoogleSearchAgentTool` Workaround

A current limitation of the ADK is that built-in tools (like `google_search`) cannot be directly combined with custom function tools. To overcome this, the ADK provides the `GoogleSearchAgentTool`, a special wrapper that exposes the `google_search` tool as a regular `FunctionTool`.
