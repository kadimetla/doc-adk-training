
---
title: Programmatic Execution
---

## Module 6: Running an Agent Programmatically

## Overview

To integrate your agent into a larger application, you need to run it programmatically. This gives you complete control over the agent's lifecycle.

### Core Components

1.  **The Runner (`InMemoryRunner`):** The engine responsible for the entire agent lifecycle.
2.  **The Session Service (`runner.session_service`):** Manages conversation history and shared state.
3.  **Structured Messages (`types.Content`):** User input must be packaged in a structured `Content` object.

### The Asynchronous Event Loop

When you call `runner.run_async()`, you get an asynchronous generator that yields `Event` objects as they happen. You use an `async for` loop to iterate through these events and handle them, such as printing the final response.
