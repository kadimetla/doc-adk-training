---
sidebar_position: 1
title: "Module 39: ADK Plugins"
---

# Module 39: Enhancing Agents with ADK Plugins

## Theory

### What are Plugins?

As you build more complex agents, you'll find that certain functionality is needed across *all* your agents and tools. Features like logging, error handling, tracing, and policy enforcement are "cross-cutting concerns"—they don't belong in the core logic of a single agent, but rather in the infrastructure that runs them.

In the ADK, **Plugins** are reusable modules that hook into the agent's execution lifecycle (via callbacks) to provide this global functionality.

Unlike simple callbacks which you might attach to a single specific agent, a Plugin is typically registered once on the **Runner** (or `App`), and its logic applies globally to every step of the workflow.

### The Problem: Fragile Tool Use

One of the most common issues with LLM agents is **hallucination** or **misuse of tools**.
*   **Hallucinated Names:** The model might try to call `calculate_sum` when the tool is actually named `add_numbers`.
*   **Invalid Arguments:** The model might pass a string "five" when the tool expects the integer `5`.
*   **Transient Errors:** An API might fail temporarily with a 500 error.

Normally, these errors would cause your agent to crash or stop. To fix this, you would have to write complex `try/except` loops inside every tool or prompt the model to "be careful."

### The Solution: Reflect and Retry

The **`ReflectAndRetryToolPlugin`** is a powerful built-in plugin designed to solve this exact problem. It acts as a safety net between the Agent and the Tool execution.

**How it works:**
1.  **Intercept:** When the Agent calls a tool, the plugin watches the execution.
2.  **Detect Failure:** If the tool raises an Exception (or returns a specific error code), the plugin catches it.
3.  **Reflect:** The plugin sends the error message *back* to the LLM as an observation. (e.g., *"Error: Tool 'calc' not found. Did you mean 'calculator'?"*)
4.  **Retry:** The LLM, seeing this error, "reflects" on its mistake and generates a *new* tool call with the corrected name or arguments.
5.  **Loop:** This process repeats up to a configured `max_retries` limit.

### Using the Plugin

To use a plugin, you simply import it and add it to your `Runner` configuration.

```python
from google.adk.runner import Runner
from google.adk.plugins import ReflectAndRetryToolPlugin

# Configure the plugin
retry_plugin = ReflectAndRetryToolPlugin(
    max_retries=3  # Give the agent 3 chances to fix its mistake
)

# Add it to the Runner
runner = Runner(
    agent=my_agent,
    plugins=[retry_plugin] # <--- Registered here
)
```

### Advanced: Custom Error Logic

By default, the plugin catches Exceptions. However, some tools might return errors as data (e.g., `{"status": "error"}`). You can extend the plugin to handle this:

```python
class MyCustomRetry(ReflectAndRetryToolPlugin):
    async def extract_error_from_result(self, tool, tool_args, tool_context, result):
        # If the tool returned a dict with status="error", treat it as a failure
        if isinstance(result, dict) and result.get("status") == "error":
            return result
        return None # No error
```

### Key Takeaways
- **Plugins** provide global functionality (logging, retries, security) across your agent's workflow.
- They are registered on the `Runner` and use callbacks to intercept agent actions.
- The **`ReflectAndRetryToolPlugin`** makes agents robust by automatically catching tool errors, feeding them back to the model, and allowing it to self-correct without crashing.
- This pattern (Try -> Fail -> Reflect -> Retry) significantly improves reliability in production.
