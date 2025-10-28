
---
title: Your First Agent
---

## Module 3: Your First Agent: The "Echo" Agent

## Overview

### The Core of an ADK Agent

An ADK Agent is a blueprint that tells an LLM how to behave. It consists of:

*   **`name`:** A unique identifier.
*   **`model`:** The LLM to use (e.g., `gemini-2.5-flash`).
*   **`instruction`:** The prompt that defines the agent's persona and goals.
*   **`description`:** A short summary of the agent's purpose.

### Two Ways to Define an Agent

1.  **Configuration-Based (YAML):** Simple, fast, and great for prototyping.
    ```yaml
    name: echo_agent
    model: gemini-2.5-flash
    instruction: You are an echo agent. Repeat the user's input.
    ```

2.  **Programmatic (Python):** More powerful and flexible, required for advanced features like tools.
    ```python
    from google.adk.agents import LlmAgent

    root_agent = LlmAgent(
        name="echo_agent",
        model="gemini-2.5-flash",
        instruction="You are an echo agent. Repeat the user's input."
    )
    ```

### Scaffolding with `adk create`

The `adk create <agent_name>` command quickly sets up the file structure for a new agent, creating either a `root_agent.yaml` or `agent.py` file.
