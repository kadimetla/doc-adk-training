# Module 36: Best Practices & Production Patterns

## Lab 36: Building a Production-Ready Agent

### Goal

In this lab, you will build a **Best Practices Agent** that demonstrates several production-ready patterns, including input validation, error handling with retries, and caching. This will provide a tangible example of how to apply the concepts from the theory section.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    ```shell
    adk create best-practices-agent
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd best-practices-agent
    ```

### Step 2: Implement the Production-Ready Tools

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and identify the best practices that have been implemented in its tools:

1.  **`validate_input_tool`:**
    *   **Input Validation:** Notice how it uses a `Pydantic` model (`ValidatedInput`) to automatically validate the `user_id` (with a regex) and `query` (with a max length). This prevents invalid data from ever reaching your core logic.

2.  **`retry_with_backoff_tool`:**
    *   **Resilience:** This tool simulates calling an external API that might fail. It is decorated with a `@retry` decorator that will automatically retry the function with exponential backoff (waiting 1s, then 2s, then 4s) if it fails.

3.  **`cache_operation_tool`:**
    *   **Performance:** This tool simulates a slow database query. It is decorated with `@functools.lru_cache(maxsize=128)`. This tells Python to automatically cache the results. If you call the tool with the same `item_id` again, the result will be returned instantly from the cache instead of running the slow query again.

### Step 3: Run and Test the Agent

1.  **Install dependencies:**
    This agent requires `pydantic` for validation and `retry` for the backoff mechanism.
    ```shell
    pip install pydantic retry
    ```

2.  **Set up your `.env` file** with your API key or Vertex AI project.

3.  **Run the agent with the Dev UI:**
    ```shell
    adk web
    ```

4.  **Interact with the Agent and Observe the Patterns:**
    *   Open the Dev UI (`http://localhost:8080`).
    *   **Test Caching:**
        *   **User:** "Fetch item `item-123`"
        *   **Observe:** The first time, there will be a 2-second delay (simulating the slow query).
        *   **User:** "Fetch item `item-123` again"
        *   **Observe:** The second time, the response will be instantaneous because it was served from the cache.
    *   **Test Validation:**
        *   **User:** "Validate user `user_!@#$` with query `test`"
        *   **Observe:** The agent will return an error because the `user_id` contains invalid characters, as defined by the Pydantic model's regex.
    *   **Test Retries:**
        *   **User:** "Attempt a flaky operation"
        *   **Observe the console where `adk web` is running.** You will see the log messages showing the tool failing, waiting, and then retrying until it finally succeeds.

### Lab Summary

You have successfully built an agent with tools that incorporate production-grade best practices.

You have learned to:
*   Use `Pydantic` for robust input validation in your tools.
*   Implement automatic retries with exponential backoff to make your tools more resilient to transient failures.
*   Use caching with `lru_cache` to dramatically improve the performance of frequently called, slow operations.
*   Understand how these patterns contribute to building more reliable and efficient agents.
