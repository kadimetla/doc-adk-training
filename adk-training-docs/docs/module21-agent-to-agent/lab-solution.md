---
sidebar_position: 3
---
# Module 35: Agent-to-Agent Communication

# Lab 21: Solution

This file contains the complete code for the two separate agent projects in the lab: the `research-specialist` (server) and the `a2a-orchestrator` (client).

### `research-specialist/agent.py`

```python
from google.adk.agents import Agent
from google.adk.a2a.utils.agent_to_a2a import to_a2a
from google.adk.tools import google_search

# 1. Define the specialist agent
# This agent's job is to perform web research.
root_agent = Agent(
    model="gemini-1.5-flash",
    name="research_specialist",
    description="A specialist agent that conducts web research and fact-checking using Google Search.",
    instruction="""
You are a research specialist. Your only job is to answer the user's query by using the `google_search` tool.
Provide a comprehensive summary of the search results.
Cite your sources.
""",
    tools=[google_search]
)

# 2. Expose the agent as an A2A web application
# This creates a FastAPI-like app that handles the A2A protocol.
a2a_app = to_a2a(root_agent, port=8001)

# To run this server, you would use the command:
# uvicorn agent:a2a_app --host localhost --port 8001
```

### `a2a-orchestrator/agent.py`

```python
from google.adk.agents import Agent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent, AGENT_CARD_WELL_KNOWN_PATH

# 1. Create a proxy to the remote agent using RemoteA2aAgent.
# The ADK will use the agent card to discover how to communicate with it.
remote_researcher = RemoteA2aAgent(
    name="remote_researcher",
    description="A remote specialist that can conduct web research and fact-checking.",
    agent_card=(
        f"http://localhost:8001/a2a/research_specialist{AGENT_CARD_WELL_KNOWN_PATH}"
    )
)

# 2. Define the orchestrator agent.
# This agent's job is to delegate tasks to the appropriate specialist.
root_agent = Agent(
    model="gemini-1.5-flash",
    name="orchestrator_agent",
    description="A coordinator agent that delegates tasks to remote specialists.",
    instruction="""
You are a main orchestrator agent.
Your job is to understand the user's request and delegate it to the correct remote specialist.
If the user asks you to perform research, you MUST delegate the task to the `remote_researcher` sub-agent.
Do not try to answer research questions yourself.
    """,
    # 3. Register the remote agent as a sub-agent.
    sub_agents=[remote_researcher]
)
```
