
---
title: Advanced Function Tools
---

## Module 10: Advanced Function Tools

## Overview

### Automatic Parallel Tool Execution

One of the most powerful features of the ADK is its ability to execute multiple tools simultaneously. If a user's query requires several independent pieces of information, the agent's LLM is smart enough to request all the necessary tool calls in a single turn.

This provides a significant performance benefit, as the total time to get a response is determined by the *longest-running tool*, not the sum of all tool execution times.

### Best Practices for Complex Tools

*   **Input Validation:** Never assume the LLM will provide perfect inputs. Validate arguments to prevent errors.
*   **Structured Error Handling:** Always return a structured error dictionary so the LLM can understand what went wrong.
*   **Human-Readable Reports:** The `report` field in your return dictionary should contain a pre-formatted, user-friendly string.
