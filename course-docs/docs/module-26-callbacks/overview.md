
---
title: Callbacks and Guardrails
---

## Module 26: Callbacks and Guardrails

## Overview

### What are Callbacks?

Callbacks are Python functions that you register with an agent to run at specific "checkpoints" during its execution. They allow you to **observe**, **control**, and **implement guardrails**.

### The Callback Lifecycle and Control Flow

The key to using callbacks for control is the value your function returns:

*   **Return `None`:** The default behavior. The execution flow continues normally.
*   **Return an Object:** This **overrides** the default behavior. The agent will skip the standard operation and use the object you returned instead.

This allows you to implement input guardrails (`before_model_callback`), output filtering (`after_model_callback`), and argument validation (`before_tool_callback`).
