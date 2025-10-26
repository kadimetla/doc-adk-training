# Module 26: Callbacks and Guardrails - Agent Safety and Monitoring

## Theory

### Beyond Standard Execution: The Need for Control

Production-grade agents require more than just a simple request-response loop. They need safety checks, monitoring, and the ability to dynamically control their own behavior. **Callbacks** are the ADK's primary mechanism for injecting this custom logic into the agent's execution lifecycle.

### What are Callbacks?

Callbacks are Python functions that you register with an agent to run at specific "checkpoints" during its execution. They allow you to:

*   **Observe:** Log LLM prompts, tool calls, and agent responses for auditing and debugging.
*   **Control:** Intercept and block or modify operations before they happen.
*   **Implement Guardrails:** Enforce safety policies, such as preventing the generation of harmful content or the use of tools with invalid arguments.

### The Callback Lifecycle and Control Flow

The ADK provides a rich set of callbacks. The key to using them for control is the value your function returns:

*   **Return `None`:** The default behavior. This tells the ADK to continue the execution flow normally. This is used for observation (e.g., logging).
*   **Return an Object:** This **overrides** the default behavior. The agent will skip the standard operation (e.g., calling the LLM, running a tool) and use the object you returned instead.

Here are the primary callbacks for an `LlmAgent`:

| Callback | Trigger | Control Action (Return Value) | Use Case |
| :--- | :--- | :--- | :--- |
| `before_agent_callback` | Before the agent starts. | `Content` object | Skip the entire agent run and return a canned response (e.g., for maintenance mode). |
| `before_model_callback` | Before calling the LLM. | `LlmResponse` object | **Input Guardrail:** Block an inappropriate prompt and return a safety message. |
| `after_model_callback` | After the LLM responds. | `LlmResponse` object | **Output Filtering:** Modify the LLM's response to remove sensitive information (PII) before the user sees it. |
| `before_tool_callback` | Before a tool is executed. | `dict` | **Argument Validation:** Block a tool call with invalid arguments and return an error dictionary. |
| `after_tool_callback` | After a tool runs. | `dict` | **Result Modification:** Change the result of a tool before it's sent back to the LLM for the next step. |
| `after_agent_callback` | After the agent finishes. | `Content` object | Add a standard disclaimer or footer to every final agent response. |

By mastering this "return None vs. return Object" pattern, you can build robust, production-ready agents with sophisticated safety and monitoring capabilities.