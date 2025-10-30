---
sidebar_label: Lab Challenge
sidebar_position: 2
---
sidebar_label: Lab Challenge
---
sidebar_label: Lab Challenge
# Module 10: OpenAPI Tools

# Lab 11: Challenge

This file contains the complete code for the `agent.py` script in the Chuck Norris Fact Assistant lab.

### `chuck-norris-agent/agent.py`

```python
"""
Chuck Norris Fact Assistant - OpenAPI Tools Demonstration

This agent demonstrates how to use OpenAPIToolset to automatically
generate tools from an API specification without writing tool functions.
"""

from google.adk.agents import Agent
from google.adk.tools.openapi_tool import OpenAPIToolset

# ============================================================================
# OPENAPI SPECIFICATION
# ============================================================================

# Chuck Norris API OpenAPI Specification
# Based on: https://api.chucknorris.io/
CHUCK_NORRIS_SPEC = {
    "openapi": "3.0.0",
    "info": {
        "title": "Chuck Norris API",
        "description": "Free JSON API for hand curated Chuck Norris facts",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "https://api.chucknorris.io/jokes"
        }
    ],
    "paths": {
        "/random": {
            "get": {
                "operationId": "get_random_joke",
                "summary": "Get a random Chuck Norris joke",
                "description": "Retrieve a random joke from the database. Can optionally filter by category.",
                "parameters": [
                    {
                        "name": "category",
                        "in": "query",
                        "description": "Filter jokes by category (optional)",
                        "required": False,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "icon_url": {"type": "string"},
                                        "id": {"type": "string"},
                                        "url": {"type": "string"},
                                        "value": {"type": "string"}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/search": {
            "get": {
                "operationId": "search_jokes",
                "summary": "Search for jokes",
                "description": "Free text search for jokes containing the query term.",
                "parameters": [
                    {
                        "name": "query",
                        "in": "query",
                        "description": "Search query (3+ characters required)",
                        "required": True,
                        "schema": {
                            "type": "string",
                            "minLength": 3
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "total": {"type": "integer"},
                                        "result": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "icon_url": {"type": "string"},
                                                    "id": {"type": "string"},
                                                    "url": {"type": "string"},
                                                    "value": {"type": "string"}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/categories": {
            "get": {
                "operationId": "get_categories",
                "summary": "Get all joke categories",
                "description": "Retrieve list of available joke categories.",
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

# ============================================================================
# OPENAPI TOOLSET
# ============================================================================

# Create OpenAPIToolset from specification
chuck_norris_toolset = OpenAPIToolset(spec_dict=CHUCK_NORRIS_SPEC)

# ============================================================================
# AGENT DEFINITION
# ============================================================================

root_agent = Agent(
    name="chuck_norris_agent",
    model="gemini-2.5-flash",
    description="A Chuck Norris fact assistant that can retrieve jokes/facts from the Chuck Norris API.",
    instruction="""
    You are a fun Chuck Norris fact assistant!

    CAPABILITIES:
    - Get random Chuck Norris jokes (optionally filtered by category)
    - Search for jokes containing specific keywords
    - List all available joke categories

    WORKFLOW:
    - For random requests -> use get_random_joke
    - For specific topics -> use search_jokes with query
    - To see categories -> use get_categories
    - For category-specific random -> use get_random_joke with category parameter

    IMPORTANT:
    - Always extract the 'value' field from the API response (that's the actual joke).
    - If a search finds 0 results, suggest trying a different keyword.
    """,
    tools=[chuck_norris_toolset]
)
```
