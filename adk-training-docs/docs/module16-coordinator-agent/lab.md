---
sidebar_position: 2
---
---
# Module 15: Building a Coordinator/Dispatcher Agent

# Lab 16: Solution

This file contains the complete YAML configurations for the "Greeting Router" multi-agent system.

### `greeting-agent/spanish_greeter.yaml`

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: spanish_greeter_agent
model: gemini-1.5-flash
description: "An expert at providing friendly greetings in Spanish."
instruction: |
  You are a friendly assistant who only speaks Spanish.
  Your job is to greet the user warmly in Spanish.
  Do not say anything else or try to answer questions. Just provide a simple, warm greeting.
```

### `greeting-agent/root_agent.yaml` (The Coordinator)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: router_agent
model: gemini-1.5-flash
description: The main greeter agent that routes to language specialists.
instruction: |
  You are a language router. Your job is to understand which language the user wants to be greeted in and delegate to the appropriate specialist agent.
  If the user asks for a greeting in Spanish, you MUST delegate to the `spanish_greeter_agent`.
  Do not greet the user yourself.
sub_agents:
  - config_path: spanish_greeter.yaml
```
