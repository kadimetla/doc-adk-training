---
sidebar_position: 2
title: Challenge Lab
---

# Lab 38: Building a Production-Ready Agent Challenge

## Goal

In this lab, you will build a **Best Practices Agent** that demonstrates several production-ready patterns, including input validation, error handling with retries, and caching.

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

**Exercise:** Open `agent.py`. Skeletons for three tools are provided. Your task is to apply the best practices of validation, resilience, and caching using the `# TODO` comments as a guide.

```python
# In agent.py (Starter Code)
import time
import random
import functools
from pydantic import BaseModel, Field, constr
from retry import retry

from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google.adk.tools.tool_context import ToolContext # Import ToolContext

# --- 1. Input Validation with Pydantic ---
sidebar_position: 2

class ValidatedInput(BaseModel):
    """A Pydantic model to validate inputs for a tool."""
    user_id: constr(regex=r'^[a-zA-Z0-9_-]{3,50}$')
    query: str = Field(..., max_length=1000)

# TODO: 1. Implement this tool. Inside a try/except block, attempt to
# instantiate the `ValidatedInput` model with the provided `user_id` and `query`.
# Return a success dictionary if it validates, or an error dictionary if it fails.
def validate_input_tool(user_id: str, query: str, tool_context: ToolContext) -> dict:
    """Validates user_id and query using a Pydantic model."""
    try:
        ValidatedInput(user_id=user_id, query=query)
        return {"status": "success", "message": "Input is valid."}
    except ValueError as e:
        return {"status": "error", "message": f"Invalid input: {e}"}

# --- 2. Resilience with Retries and Exponential Backoff ---
sidebar_position: 2

# TODO: 2. Apply the `@retry` decorator to this function. Configure it to
# try 4 times with a delay that doubles, starting at 1 second.
# Note: `logger=None` prevents duplicate logging if a root logger is already configured.
@retry(tries=4, delay=1, backoff=2, logger=None)
def _flaky_api_call():
    """Simulates an API call that might fail."""
    print("Attempting to call the flaky API...")
    if random.random() > 0.33: # 67% chance of failure
        print("API call failed! Retrying...")
        raise ConnectionError("The external API is temporarily unavailable.")
    print("API call succeeded!")
    return {"status": "success", "data": "Successfully retrieved data."}

def retry_with_backoff_tool(tool_context: ToolContext) -> dict:
    """Calls an external service that might fail intermittently."""
    try:
        return _flaky_api_call()
    except ConnectionError as e:
        return {"status": "error", "message": f"The API call failed after multiple retries: {e}"}

# --- 3. Performance with Caching ---
sidebar_position: 2

# TODO: 3. Apply the `@functools.lru_cache` decorator to this function
# to cache its results. Set a maxsize of 128.
# Note: `lru_cache` is a built-in Python decorator for memoization.
@functools.lru_cache(maxsize=128)
def _slow_database_query(item_id: str) -> str:
    """Simulates a slow database query that takes 2 seconds."""
    print(f"Performing slow query for item: {item_id}...")
    time.sleep(2)
    print("Query complete.")
    return f"Data for {item_id}"

def cache_operation_tool(item_id: str, tool_context: ToolContext) -> dict:
    """Fetches data from a slow database with caching."""
    result = _slow_database_query(item_id)
    return {"status": "success", "data": result}

# --- Agent Definition ---
sidebar_position: 2

# TODO: 4. Define the `root_agent`. Give it an instruction to use the
# appropriate tool based on the user's request and register your three
# new tools with it.
root_agent = Agent(
    model='gemini-2.5-flash',
    name='best_practices_agent',
    instruction="""
You are an agent that demonstrates production best practices.
You have tools for validation, resilience, and performance.
Use the appropriate tool based on the user's request.
""",
    tools=[
        FunctionTool(validate_input_tool),
        FunctionTool(retry_with_backoff_tool),
        FunctionTool(cache_operation_tool),
    ]
)
```

### Step 3: Run and Test the Agent

1.  **Install dependencies:**
    ```shell
    pip install pydantic retry
    ```
2.  **Set up your `.env` file** and start the Dev UI:
    ```shell
    adk web best-practices-agent
    ```
3.  **Interact with the Agent and Observe the Patterns:**
    *   **Test Caching:**
        *   "Fetch item `item-123`" (will be slow)
        *   "Fetch item `item-123` again" (will be instant)
    *   **Test Validation:**
        *   "Validate user `user_!@#$` with query `test`" (will fail)
    *   **Test Retries:**
        *   "Attempt a flaky operation" (observe the console for retry logs)

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary
You have successfully built an agent with tools that incorporate production-grade best practices. You have learned to:
*   Use `Pydantic` for robust input validation.
*   Implement automatic retries with `retry`.
*   Use caching with `lru_cache` to improve performance.

### Self-Reflection Questions
- The `@lru_cache` decorator stores results in memory. What are the limitations of this caching strategy in a distributed, multi-instance deployment on a platform like Cloud Run? What would be a better solution for caching in that environment?
- Our `_flaky_api_call` function simulates a network error. What other kinds of errors should a production-grade tool handle gracefully?
- How does using a library like `Pydantic` for input validation make your tools more secure and reliable compared to writing manual `if/else` checks?
