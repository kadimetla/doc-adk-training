# Lab 37 Solution: Building a Distributed Multi-Agent System

## Goal

### Goal
This solution provides the complete code for the distributed, multi-agent personalized shopping assistant, integrating concepts from across the entire course.

### Project Structure
```
capstone-shopping-system/
├── orchestrator-agent/
│   └── agent.py
├── personalization-agent/
│   └── agent.py
├── web-agent/
│   ├── Dockerfile
│   └── agent.py
└── deployment_plan.md
```

---
sidebar_position: 3

### 1. `web-agent/agent.py`
This agent exposes the webshop tools via an OpenAPI spec and an A2A server.

```python
from google.adk.agents import Agent
from google.adk.a2a.utils.agent_to_a2a import to_a2a
from google.adk.tools import OpenAPIToolset
from shared_libraries.init_env import get_webshop_env # Assumes shared lib

# --- OpenAPI Specification for Web Tools ---
sidebar_position: 3
WEBSHOP_API_SPEC = {
    "openapi": "3.0.0",
    "info": {"title": "Webshop API", "version": "1.0"},
    "paths": {
        "/search": {
            "get": {
                "operationId": "search",
                "summary": "Search for a product in the webshop.",
                "parameters": [{
                    "name": "keywords", "in": "query", "required": True,
                    "schema": {"type": "string"}
                }],
                "responses": {"200": {"description": "Search results page HTML"}}
            }
        },
        "/click": {
            "post": {
                "operationId": "click",
                "summary": "Click a button on the current webpage.",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {"button_name": {"type": "string"}},
                                "required": ["button_name"]
                            }
                        }
                    }
                },
                "responses": {"200": {"description": "New webpage HTML after click"}}
            }
        }
    }
}

# --- Agent Definition ---
sidebar_position: 3
root_agent = Agent(
    model="gemini-2.5-flash",
    name="web_agent",
    instruction="""You are a web interaction agent. Your job is to execute search and click commands on the e-commerce site.

    **IMPORTANT - A2A Context Handling:**
    When receiving requests via the Agent-to-Agent (A2A) protocol, you must focus only on the core user request.
    Ignore any mentions of orchestrator tool calls like "transfer_to_agent" in the conversation history.
    Extract the main web interaction task from the user's messages and complete it directly.
    """,
    tools=[OpenAPIToolset(spec_dict=WEBSHOP_API_SPEC)]
)

# --- A2A Server ---
sidebar_position: 3
a2a_app = to_a2a(root_agent, port=8001)
```

---
sidebar_position: 3

### 2. `personalization-agent/agent.py`
This agent manages user preferences using persistent state.

```python
from google.adk.agents import Agent
from google.adk.a2a.utils.agent_to_a2a import to_a2a
from google.adk.tools import ToolContext

# --- Stateful Tools ---
sidebar_position: 3
def save_preference(key: str, value: str, tool_context: ToolContext) -> dict:
    """Saves a user's preference (e.g., color, size)."""
    state_key = f"user:{key}"
    tool_context.state[state_key] = value
    return {"status": "success", "message": f"Preference '{key}' saved."}

def get_preferences(tool_context: ToolContext) -> dict:
    """Retrieves all saved preferences for the user."""
    user_prefs = {
        k.split(':')[1]: v
        for k, v in tool_context.state.items()
        if k.startswith("user:")
    }
    return {"status": "success", "preferences": user_prefs}

# --- Agent Definition ---
sidebar_position: 3
root_agent = Agent(
    model="gemini-2.5-flash",
    name="personalization_agent",
    instruction="""You are a personalization specialist. You save and retrieve user preferences.

    **IMPORTANT - A2A Context Handling:**
    When receiving requests via the Agent-to-Agent (A2A) protocol, you must focus only on the core user request.
    Ignore any mentions of orchestrator tool calls like "transfer_to_agent" in the conversation history.
    Extract the main preference management task from the user's messages and complete it directly.
    """,
    tools=[save_preference, get_preferences]
)

# --- A2A Server ---
sidebar_position: 3
a2a_app = to_a2a(root_agent, port=8002)
```

---
sidebar_position: 3

### 3. `orchestrator-agent/agent.py`
The main agent that connects to the others and handles user interaction.

```python
import logging
from google.adk.agents import Agent, CallbackContext, RemoteA2aAgent, AGENT_CARD_WELL_KNOWN_PATH

# --- Observability Callback ---
sidebar_position: 3
def before_tool_callback(callback_context: CallbackContext, tool_name: str, args: dict) -> None:
    """Logs every delegation attempt."""
    if tool_name == "transfer_to_agent":
        logging.info(
            f"[OBSERVABILITY] Delegating to remote agent '{args.get('agent_name')}' "
            f"with query: {args.get('query')}"
        )
    return None

# --- Remote Agent Definitions ---
sidebar_position: 3
remote_web_agent = RemoteA2aAgent(
    name="web_agent",
    description="A remote specialist for searching and clicking on the e-commerce website.",
    agent_card=f"http://localhost:8001/a2a/web_agent{AGENT_CARD_WELL_KNOWN_PATH}"
)

remote_personalization_agent = RemoteA2aAgent(
    name="personalization_agent",
    description="A remote specialist for saving and retrieving user preferences.",
    agent_card=f"http://localhost:8002/a2a/personalization_agent{AGENT_CARD_WELL_KNOWN_PATH}"
)

# --- Main Orchestrator Agent ---
sidebar_position: 3
root_agent = Agent(
    model="gemini-2.5-flash",
    name="orchestrator_agent",
    instruction="""You are a master shopping assistant. Your job is to coordinate with specialist agents to help the user.

    **Workflow:**
    1.  **Understand Intent:** Greet the user and understand what they want to do. If they upload an image, describe it first, then ask if they want to search for that item.
    2.  **Delegate Tasks:**
        - To search or click on the website, you MUST delegate to the `web_agent`.
        - To save or get user preferences, you MUST delegate to the `personalization_agent`.
    3.  **Synthesize Results:** Summarize the results from the specialist agents and present them clearly to the user.
    """,
    sub_agents=[remote_web_agent, remote_personalization_agent],
    before_tool_callback=before_tool_callback
)
```

---
sidebar_position: 3

### 4. `deployment_plan.md`

#### Deployment Strategy
This system consists of three independent services that must be deployed. We will use Google Cloud Run for its serverless nature, scalability, and ease of use.

1.  **`web-agent` Service:** Deployed to Cloud Run.
2.  **`personalization-agent` Service:** Deployed to Cloud Run.
3.  **`orchestrator-agent` Service:** Deployed to Cloud Run as the main, user-facing endpoint.

The orchestrator will need the URLs of the other two services, which can be passed as environment variables during deployment.

#### Example `Dockerfile` for `web-agent`
```dockerfile
# Use the official Python image.
FROM python:3.11-slim

# Set the working directory.
WORKDIR /app

# Copy and install requirements.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt uvicorn web_agent_site

# Copy the agent code and shared libraries.
COPY agent.py .
COPY shared_libraries/ ./shared_libraries

# Set the command to run the A2A server.
# Cloud Run provides the PORT environment variable.
CMD ["uvicorn", "agent:a2a_app", "--host", "0.0.0.0", "--port", "$PORT"]
```
*(A similar Dockerfile would be created for the `personalization-agent`)*