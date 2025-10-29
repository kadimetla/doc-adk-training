sidebar_position: 3
---
## Module 38: Best Practices # Module 36: Best Practices & Production Patterns Production Patterns

# Lab 38: Solution

# Lab 38: Solution

This file contains the complete code for the `agent.py` script in the Best Practices Agent lab.

### `best-practices-agent/agent.py`

```python
import time
import random
import functools
from pydantic import BaseModel, Field, constr
from retry import retry

from google.adk.agents import Agent
from google.adk.tools import FunctionTool

# --- 1. Input Validation with Pydantic ---

class ValidatedInput(BaseModel):
    """A Pydantic model to validate inputs for a tool."""
    user_id: constr(regex=r'^[a-zA-Z0-9_-]{3,50}$')
    query: str = Field(..., max_length=1000)

def validate_input_tool(user_id: str, query: str) -> dict:
    """
    Validates user_id and query using a Pydantic model.
    Use this to check if inputs are safe and correctly formatted.
    """
    try:
        ValidatedInput(user_id=user_id, query=query)
        return {"status": "success", "message": "Input is valid."}
    except ValueError as e:
        return {"status": "error", "message": f"Invalid input: {e}"}

# --- 2. Resilience with Retries and Exponential Backoff ---

# This is a decorator that will retry the function if it raises an exception.
# It will wait 1s, then 2s, then 4s between retries.
@retry(tries=4, delay=1, backoff=2, logger=None)
def _flaky_api_call():
    """Simulates an API call that might fail."""
    print("Attempting to call the flaky API...")
    if random.random() > 0.33: # 67% chance of failure
        print("API call failed! Retrying...")
        raise ConnectionError("The external API is temporarily unavailable.")
    print("API call succeeded!")
    return {"status": "success", "data": "Successfully retrieved data."}

def retry_with_backoff_tool() -> dict:
    """
    Calls an external service that might fail intermittently.
    This tool has built-in retries with exponential backoff.
    """
    try:
        return _flaky_api_call()
    except ConnectionError as e:
        return {"status": "error", "message": f"The API call failed after multiple retries: {e}"}

# --- 3. Performance with Caching ---

@functools.lru_cache(maxsize=128)
def _slow_database_query(item_id: str) -> str:
    """Simulates a slow database query that takes 2 seconds."""
    print(f"Performing slow query for item: {item_id}...")
    time.sleep(2)
    print("Query complete.")
    return f"Data for {item_id}"

def cache_operation_tool(item_id: str) -> dict:
    """
    Fetches data from a slow database.
    Results are cached to improve performance for repeated calls.
    """
    result = _slow_database_query(item_id)
    return {"status": "success", "data": result}

# --- Agent Definition ---

root_agent = Agent(
    model='gemini-1.5-flash',
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
