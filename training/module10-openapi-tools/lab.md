# Module 10: OpenAPI Tools

## Lab 10: Building a Chuck Norris Fact Assistant

### Goal

In this lab, you will build an agent that can retrieve Chuck Norris jokes from a public REST API. You will learn how to use the `OpenAPIToolset` to automatically generate the necessary tools from an OpenAPI specification.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    Choose the **Programmatic (Python script)** option when prompted.
    ```shell
    adk create chuck-norris-agent
    cd chuck-norris-agent
    ```

2.  **Set up your API key** in the `.env` file. (The Chuck Norris API is free, but the agent needs credentials for the Gemini model).

### Step 2: Define the OpenAPI Specification

**Exercise:** Open `agent.py`. A skeleton for the OpenAPI specification is provided. Your first task is to complete the spec for the `/random` endpoint. You can find the necessary information from the API documentation at [https://api.chucknorris.io/](https://api.chucknorris.io/).

```python
# In agent.py (Starter Code)

from google.adk.agents import Agent
from google.adk.tools.openapi_tool import OpenAPIToolset

# ============================================================================
# OPENAPI SPECIFICATION
# ============================================================================

# TODO: Complete the OpenAPI spec for the "/random" endpoint's GET operation.
# - The operationId should be "get_random_joke".
# - The summary should be "Get a random Chuck Norris joke".
# - It should have one optional query parameter named "category".
CHUCK_NORRIS_SPEC = {
    "openapi": "3.0.0",
    "info": {
        "title": "Chuck Norris API",
        "description": "Free JSON API for hand curated Chuck Norris facts",
        "version": "1.0.0"
    },
    "servers": [{"url": "https://api.chucknorris.io/jokes"}],
    "paths": {
        "/random": {
            "get": {
                # Fill in this section based on the TODO above
            }
        },
        # (The other paths are provided for you below)
        "/search": {
            "get": {
                "operationId": "search_jokes",
                "summary": "Search for jokes",
                "parameters": [{
                    "name": "query", "in": "query", "required": True,
                    "schema": {"type": "string", "minLength": 3}
                }],
                "responses": {"200": {"description": "Successful response"}}
            }
        },
        "/categories": {
            "get": {
                "operationId": "get_categories",
                "summary": "Get all joke categories",
                "responses": {"200": {"description": "Successful response"}}
            }
        }
    }
}

# ============================================================================
# OPENAPI TOOLSET
# ============================================================================

# TODO: Create an OpenAPIToolset instance from the spec dictionary you just completed.
chuck_norris_toolset = None

# ============================================================================
# AGENT DEFINITION
# ============================================================================

# TODO: Define the root_agent. Give it an instruction to be a fun Chuck Norris
# fact assistant and register the `chuck_norris_toolset` in its `tools` list.
root_agent = None
```

### Step 3: Run and Test Your Agent

1.  **Navigate to the parent directory** (`cd ..`) and start the Dev UI: `adk web`
2.  **Interact with the agent:**
    *   Select "chuck_norris_agent" and test its capabilities:
        *   "Tell me a random Chuck Norris joke"
        *   "Find jokes about computers"
        *   "What joke categories exist?"
        *   "Give me a random movie joke"
    *   Inspect the **Events** tab to see the `FunctionCall` for your auto-generated tools.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully integrated a live REST API into your agent without writing a single manual tool function. You have learned:
*   How to read API documentation to create an OpenAPI specification.
*   How to use `OpenAPIToolset` to automatically generate tools from a spec.
*   How to instruct your agent to use the new, auto-generated tools.
