# Module 26: Callbacks and Guardrails - Building a Content Moderator

## Lab 26: Building a Content Moderation Assistant

### Goal

In this lab, you will implement a full suite of callbacks to create a **Content Moderation Assistant**. This agent will demonstrate how to build production-grade safety guardrails, validation, logging, and response filtering.

### The Use Case

You will build a writing assistant that:
*   **Blocks** inappropriate requests before they reach the LLM (`before_model_callback`).
*   **Validates** tool arguments to prevent invalid values (`before_tool_callback`).
*   **Logs** all LLM and tool interactions for monitoring.
*   **Filters** personally identifiable information (PII) from LLM responses (`after_model_callback`).
*   **Tracks** usage metrics (like blocked requests) in the session state.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create content-moderator
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd content-moderator
    ```

### Step 2: Implement the Agent and Callbacks

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this comprehensive example and understand how each callback contributes to the agent's safety and observability:

1.  **`BLOCKED_WORDS` and `PII_PATTERNS`:** Review these simple configurations that define what the guardrails will look for.

2.  **`before_model_callback` (Input Guardrail):**
    *   This is the primary safety check. Notice how it inspects the `llm_request` for any blocked words.
    *   If a blocked word is found, it **returns an `LlmResponse` object**. This is the control flow pattern: by returning a response, it tells the ADK to **skip the actual LLM call** and use this response instead.
    *   It also increments a `user:blocked_requests` counter in the state.

3.  **`before_tool_callback` (Argument Validation):**
    *   This callback checks the arguments *before* a tool is run.
    *   If the `word_count` for the `generate_text` tool is invalid (e.g., negative), it **returns a dictionary**. This dictionary is treated as the tool's output, and the actual tool function is never executed.

4.  **`after_model_callback` (Output Filtering):**
    *   This callback inspects the `llm_response` *after* it comes back from the model.
    *   It uses regular expressions to find and replace potential PII.
    *   If it finds PII, it constructs and **returns a new, modified `LlmResponse` object**, replacing the original one.

5.  **Logging and Metrics:**
    *   Notice how nearly every callback uses `logger.info()` for **observation**.
    *   Several callbacks also interact with the `callback_context.state` to increment counters, demonstrating how to build a simple metrics system.

6.  **Agent Definition:**
    *   Finally, see how all the callback functions are registered with the `Agent` at the bottom of the file.

### Step 3: Run and Test the Guardrails

1.  **Set up your API key** in the `.env` file.

2.  **Navigate to the parent directory** and start the Dev UI:
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "content_moderator".
    *   Test each of the safety features.

    **Test Scenarios:**
    *   **Normal Request:** "Generate a 100-word article about dogs."
        *   _(Observe the console logs to see all the callbacks firing in sequence.)_
    *   **Blocked Request:** "Write an article about profanity1."
        *   **Expected Output:** The agent should immediately respond with the "inappropriate content" message. Check the console to see the `[LLM BLOCKED]` log.
    *   **Invalid Tool Argument:** "Generate an article with -50 words."
        *   **Expected Output:** The agent should respond with the "Invalid word_count" error message. Check the console to see the `[TOOL BLOCKED]` log.
    *   **PII Filtering:** "My email is test@example.com, can you format it?"
        *   **Expected LLM Response (in Events tab):** The raw LLM response will contain the email.
        *   **Expected Final Output:** The agent's final response in the chat will be "[EMAIL_REDACTED]".
    *   **Check Stats:** "Show my usage stats."
        *   _(The agent will call the `get_usage_stats` tool, which reads the counters that were updated by the callbacks in the state.)_

### Lab Summary

You have built a robust agent with a comprehensive suite of safety guardrails and monitoring hooks. You have learned:
*   How to implement an input guardrail with `before_model_callback`.
*   How to validate tool arguments with `before_tool_callback`.
*   How to filter and redact sensitive information from LLM responses with `after_model_callback`.
*   How to use callbacks for logging and collecting metrics.
*   The critical control flow pattern of returning `None` to allow execution vs. returning an object to override it.