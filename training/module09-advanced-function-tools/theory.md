# Module 9: Advanced Function Tools

## Theory

### Giving Your Agent Superpowers

While a conversational agent is powerful, its capabilities are limited to the knowledge inherent in the LLM. To perform real-world tasks, agents need **tools**. **Function Tools** are the most direct way to give your agent custom abilities by connecting it to your own Python code.

### How Function Tools Work

A Function Tool is a regular Python function that you make available to your agent. The ADK and the underlying LLM work together to make this seamless:

1.  **Automatic Schema Generation:** The ADK inspects your Python function's signature—including its name, parameters, type hints, and docstring.
2.  **Tool Discovery:** This information is provided to the LLM as part of the prompt. The LLM reads this "schema" to understand what the tool does, when it should be used, and what arguments it requires.
3.  **Autonomous Invocation:** Based on the user's request, the LLM decides if a tool is needed. If so, it issues a `FunctionCall` request, specifying the tool's name and the arguments it inferred from the user's prompt.
4.  **Execution and Response:** The ADK executes your Python function with the provided arguments and sends the result back to the LLM, which then formulates a final, human-readable response.

You never manually trigger a tool; the agent's reasoning engine (the LLM) does it for you.

### Best Practices for Tool Design

For the LLM to use your tools effectively, you must provide a clear and structured definition.

*   **Descriptive Docstrings:** The docstring is the primary way the LLM understands a tool's purpose. It should clearly explain what the function does and when to use it.
*   **Clear Naming:** Use descriptive names for both the function (`calculate_compound_interest`) and its parameters (`annual_rate`).
*   **Type Hinting:** Use Python type hints (`principal: float`, `years: int`) to tell the LLM what data types to use for each parameter.
*   **Structured Return Values:** Tools should return a dictionary containing at least a `status` (`"success"` or `"error"`) and a `report` (the result or an error message). This structured format helps the LLM understand the outcome of the tool execution.

### Automatic Parallel Execution

One of the most powerful features of the ADK is **automatic parallel tool execution**. If a user's query requires multiple, independent calculations (e.g., "Compare the loan payments for a 15-year and a 30-year mortgage"), the LLM can request both tool calls in a single turn.

The ADK will detect these multiple requests and execute them **simultaneously** using `asyncio.gather()`. This dramatically improves performance, as the total time is limited by the slowest tool rather than the sum of all tool execution times. You get this feature for free just by designing independent, focused tools.

### How It Works (Behind the Scenes)

1.  A **user sends a message** to the ADK runner.
2.  The ADK **packages the message** into a prompt that includes:
    *   Your agent's instructions.
    *   The conversation history.
    *   The schemas for all available tools (generated from your function signatures and docstrings).
3.  The complete prompt is sent to the **Gemini LLM**.
4.  **Gemini decides** if a tool is needed to answer the user's request.
    *   If **NO**, it returns a standard text response, and the process ends.
    *   If **YES**, it returns a `FunctionCall` request, specifying the tool to run and the arguments to use.
5.  The ADK receives the `FunctionCall` and:
    *   Executes your corresponding Python function with the provided arguments.
    *   Takes the dictionary returned by your function.
    *   Sends this result back to the LLM in a new prompt.
6.  The **LLM receives the tool's result** and generates a final, human-readable response that incorporates the tool's output.