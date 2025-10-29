---
sidebar_position: 2
---
# Module 35: Agent-to-Agent Communication

# Lab 21: Exercise

### Goal

In this lab, you will build a distributed multi-agent system. You will create a main **Orchestrator** agent and a separate, standalone **Research Specialist** agent. The Orchestrator will delegate tasks to the Research Specialist over the network using the ADK's A2A capabilities.

### Step 1: Create the Project Structure

Create two separate agent projects that will run independently.
```shell
adk create a2a-orchestrator
adk create research-specialist
```
Choose the **Programmatic (Python script)** option for both.

### Step 2: Build the Research Specialist (The Server)

**Exercise:** Navigate into the `research-specialist` directory. Open `agent.py` and implement the specialist agent and expose it as an A2A server.

```python
# In research-specialist/agent.py (Starter Code)
from google.adk.agents import Agent
from google.adk.a2a.utils.agent_to_a2a import to_a2a
from google.adk.tools import google_search

# TODO: 1. Define the `root_agent`. It should be an `Agent` that:
# - Is named "research_specialist".
# - Has an instruction to act as a research specialist using the `google_search` tool.
# - Includes the `google_search` tool in its `tools` list.
root_agent = None

# TODO: 2. Use the `to_a2a()` function to wrap your `root_agent`.
# This exposes it as a web application on port 8001.
a2a_app = to_a2a(root_agent, port=8001)
```
Remember to configure your `.env` file for **Vertex AI** for the `google_search` tool to work.

### Step 3: Build the Orchestrator (The Client)

**Exercise:** Navigate into the `a2a-orchestrator` directory. Open `agent.py` and implement the orchestrator agent that consumes the remote service.

```python
# In a2a-orchestrator/agent.py (Starter Code)
from google.adk.agents import Agent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent, AGENT_CARD_WELL_KNOWN_PATH

# TODO: 1. Create a `RemoteA2aAgent` instance named `remote_researcher`.
# - Give it a name and a description.
# - Point its `agent_card` URL to the specialist server you will be running at
#   `http://localhost:8001/a2a/research_specialist/.well-known/agent-card.json`.
#   (Using the `AGENT_CARD_WELL_KNOWN_PATH` constant is recommended).
remote_researcher = None

# TODO: 2. Define the `root_agent` as an orchestrator.
# - Its instruction should tell it to delegate research tasks to the `remote_researcher`.
# - Add the `remote_researcher` to its `sub_agents` list.
root_agent = None
```
Remember to configure your `.env` file.

### Step 4: Run and Test the Distributed System

This requires two separate terminals.

1.  **Terminal 1 (Specialist Server):**
    *   Navigate to the `research-specialist` directory.
    *   Run `uvicorn agent:a2a_app --host localhost --port 8001`.

2.  **Terminal 2 (Orchestrator Client):**
    *   Navigate to the `a2a-orchestrator` directory.
    *   Run `adk web`.

3.  **Interact with the System:**
    *   Open the Dev UI for the orchestrator (`http://localhost:8080`).
    *   Give it a research task, like: "Please research the latest advancements in quantum computing."
    *   Observe the **Trace View** to confirm that the `orchestrator_agent` successfully delegates the task to the `remote_researcher`.

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

## Lab Summary
You have successfully built a distributed multi-agent system. You have learned to:
*   Expose an ADK agent as a network service using `to_a2a()`.
*   Connect to a remote agent using the `RemoteA2aAgent` class.
*   Orchestrate tasks between agents running in separate processes.