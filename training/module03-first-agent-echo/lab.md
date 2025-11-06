# Lab 3: Build and Run the "Echo" Agent Challenge

## Goal
Your task is to create, configure, and run a simple "Echo" agent using the ADK. The primary method uses Python for maximum flexibility, but a simpler YAML alternative is also provided.

## Requirements
1.  Use the `adk create` command to scaffold a new agent named `echo-agent`.
2.  Follow the **Python Approach** below to define the agent's behavior.
3.  Configure the `.env` file with your Google API key or Google Cloud project details.
4.  Run the agent using the `adk web` command.
5.  Interact with the agent in the Dev UI to verify that it correctly echoes your input.

### Python Approach (Primary)
Modify your `agent.py` file to look like the following, filling in the `TODO` sections.

```python
from google.adk.agents import LlmAgent

# TODO: Define the root_agent for your application.
# You will need to provide a name, a model, and the instruction for the agent.
root_agent = LlmAgent(
    name=...,  # TODO: Give your agent a name (e.g., "echo_agent")
    model=..., # TODO: Specify the model to use (e.g., "gemini-2.5-flash")
    instruction=...,  # TODO: Provide the instruction for the echo agent.
)
```

### Alternative Approach: Using YAML Configuration
If you prefer a simpler, config-based agent, you can use a YAML file instead of Python.

1.  Create your agent using `adk create --type=config echo-agent`. This will create a `root_agent.yaml` file instead of `agent.py`.
2.  Fill in the `TODO` sections in your `root_agent.yaml` file.

```yaml
# The first line is an optional schema definition that provides
# auto-completion and validation in compatible code editors.
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json

# TODO: Define the root_agent for your application.
name: ... # TODO: Give your agent a name (e.g., "echo_agent")
model: ... # TODO: Specify the model to use (e.g., "gemini-2.5-flash")
instruction: ... # TODO: Provide the instruction for the echo agent.
```
> **Note:** If both `agent.py` and `root_agent.yaml` exist, the ADK will use the `root_agent.yaml` file.

### Self-Reflection Questions
- What are the advantages of defining an agent in a Python script versus a YAML file?
- Why is it important to keep API keys and other secrets in a `.env` file instead of directly in your agent's code?
- Explore the "Trace" tab in the Dev UI after running your agent. What information does it provide, and how could this be useful for debugging a more complex agent?
