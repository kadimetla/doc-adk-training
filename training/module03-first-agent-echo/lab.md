# Lab 3: Build and Run the "Echo" Agent Challenge

## Goal
Your task is to create, configure, and run a simple "Echo" agent using the ADK.

## Requirements
1.  Use the `adk create` command to scaffold a new, config-based agent named `echo-agent`.
2.  Configure the `root_agent.yaml` file to define an agent that acts as an "echo". It should repeat the user's input back to them exactly as they wrote it.
3.  Configure the `.env` file with your Google API key or Google Cloud project details.
4.  Run the agent using the `adk web` command.
5.  Interact with the agent in the Dev UI to verify that it correctly echoes your input.

### Self-Reflection Questions
- What are the advantages of defining a simple agent in YAML versus a Python script?
- Why is it important to keep API keys and other secrets in a `.env` file instead of directly in your agent's configuration?
- Explore the "Trace" tab in the Dev UI after running your agent. What information does it provide, and how could this be useful for debugging a more complex agent?
