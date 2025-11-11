# Lab 16 Solution: Implementing the "Greeting Router"

## Goal

This file contains the complete Python and YAML configurations for the "Greeting Router" multi-agent system.

### Python Approach (Primary)

#### `greeting-agent/spanish_greeter_agent.py`

```python
from google.adk.agents import LlmAgent

agent = LlmAgent(
    name="spanish_greeter_agent",
    model="gemini-2.5-flash",
    description="An expert at providing friendly greetings in Spanish.",
    instruction="""
You are a friendly assistant who only speaks Spanish.
Your job is to greet the user warmly in Spanish.
Do not say anything else or try to answer questions. Just provide a simple, warm greeting.
"""
)
```

#### `greeting-agent/agent.py` (The Coordinator)

```python
from google.adk.agents import LlmAgent
from . import spanish_greeter_agent

root_agent = LlmAgent(
    name="router_agent",
    model="gemini-2.5-flash",
    description="The main greeter agent that routes to language specialists.",
    instruction="""
You are a language router. Your job is to understand which language the user wants to be greeted in and delegate to the appropriate specialist agent.
If the user asks for a greeting in Spanish, you MUST delegate to the `spanish_greeter_agent`.
Do not greet the user yourself.
""",
    sub_agents=[spanish_greeter_agent.agent]
)
```

---
sidebar_position: 3

### YAML Approach (Alternative)

#### `greeting-agent/spanish_greeter.yaml`

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: spanish_greeter_agent
model: gemini-2.5-flash
description: "An expert at providing friendly greetings in Spanish."
instruction: |
  You are a friendly assistant who only speaks Spanish.
  Your job is to greet the user warmly in Spanish.
  Do not say anything else or try to answer questions. Just provide a simple, warm greeting.
```

#### `greeting-agent/root_agent.yaml` (The Coordinator)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: router_agent
model: gemini-2.5-flash
description: The main greeter agent that routes to language specialists.
instruction: |
  You are a language router. Your job is to understand which language the user wants to be greeted in and delegate to the appropriate specialist agent.
  If the user asks for a greeting in Spanish, you MUST delegate to the `spanish_greeter_agent`.
  Do not greet the user yourself.
sub_agents:
  - config_path: spanish_greeter.yaml
```