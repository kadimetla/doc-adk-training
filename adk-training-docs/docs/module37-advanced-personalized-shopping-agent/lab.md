---
sidebar_position: 2
---
# Module 37: Advanced - Building a Personalized Shopping Agent

## Challenging Lab: Building a Distributed Multi-Agent System

### Goal
In this capstone lab, you will synthesize concepts from the entire course to build a distributed, multi-agent personalized shopping assistant. You will create three separate agents that collaborate using Agent-to-Agent (A2A) communication to provide a stateful, multimodal, and observable shopping experience.

### Setup
1.  Create a main project directory for this lab (e.g., `capstone-shopping-system`).
2.  Inside it, you will create three separate ADK agent projects: `orchestrator-agent`, `personalization-agent`, and `web-agent`.
3.  Copy the `shared_libraries` and data from the original `personalized-shopping` sample into a shared location accessible by all three agents.

---

### Exercise 1: Build and Expose the Web Agent
This agent will be the interface to the e-commerce website.

1.  **Create the `web-agent` project** (programmatic).
2.  **Implement the `search` and `click` tools** as custom Python functions that interact with the `web_agent_site` environment.
3.  **Challenge: Create an OpenAPI Specification** for your `search` and `click` tools. Define their parameters and responses in an OpenAPI v3 spec dictionary.
4.  **Define the `root_agent`**. Instead of `FunctionTool`, use the `OpenAPIToolset` to expose your tools.
5.  **Expose the agent as an A2A service** using the `to_a2a()` utility on port `8001`.

---

### Exercise 2: Build and Expose the Personalization Agent
This agent will be responsible for remembering user preferences.

1.  **Create the `personalization-agent` project** (programmatic).
2.  **Implement two tools:**
    *   `save_preference(key: str, value: str, tool_context: ToolContext)`
    *   `get_preferences(tool_context: ToolContext)`
3.  **Challenge: Implement State Management.** Inside your tools, use `tool_context.state['user:<key>'] = value` and `tool_context.state.get('user:<key>')` to ensure preferences are persisted across sessions for the user.
4.  **Define the `root_agent`** with an instruction to manage user preferences.
5.  **Expose this agent as an A2A service** on port `8002`.

---

### Exercise 3: Build the Orchestrator Agent
This is the main, user-facing agent that will coordinate the others.

1.  **Create the `orchestrator-agent` project** (programmatic).
2.  **Challenge: Connect to Remote Agents.** In `agent.py`, define two `RemoteA2aAgent` instances, one for the `web-agent` and one for the `personalization-agent`, pointing to their respective agent card URLs.
3.  **Define the `root_agent`**. Its `sub_agents` list should contain your two remote agent definitions.
4.  **Write the Orchestrator's `instruction` prompt.** This prompt must guide the agent on how to delegate tasks (e.g., "To search for a product, delegate to the `web-agent`," "To save a user's favorite color, delegate to the `personalization-agent`").
5.  **Challenge: Implement Observability.** Create a `before_tool_callback` function that logs every time the orchestrator attempts to delegate a task to a sub-agent (i.e., when it calls `transfer_to_agent`). Register this callback with your orchestrator agent.

---

### Exercise 4: Add Multimodal Vision
Enhance the Orchestrator to handle image-based searches.

1.  **Challenge: Update the Orchestrator's `instruction` prompt.** Add logic to handle image uploads. If a user provides an image, instruct the agent to:
    a.  First, describe the item in the image.
    b.  Then, use that text description to perform a search by delegating to the `web-agent`.

---

### Exercise 5: Create a Deployment Plan
Plan how you would deploy this distributed system.

1.  **Challenge: Create a `Dockerfile`** for the `web-agent`. This file should define the steps to build a container image for your remote agent.
2.  **Create a `deployment_plan.md` file.** In this file, briefly explain the steps you would take to deploy the `orchestrator-agent`, `web-agent`, and `personalization-agent` as separate services on Google Cloud Run.

### Running the System
To test your full system, you will need to run all three agents in separate terminals:
*   **Terminal 1 (`web-agent`):** `uvicorn agent:a2a_app --host localhost --port 8001`
*   **Terminal 2 (`personalization-agent`):** `uvicorn agent:a2a_app --host localhost --port 8002`
*   **Terminal 3 (`orchestrator-agent`):** `adk web`

Interact with the Orchestrator in the Dev UI and use the Trace view to observe the A2A communication and delegation.