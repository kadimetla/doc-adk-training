
---
title: Coordinator Agent
---

## Module 16: Building a Coordinator/Dispatcher Agent

## Overview

### The Coordinator Pattern

The most common multi-agent design pattern is the **Coordinator/Dispatcher**. One central `LlmAgent` acts as a manager, understanding an incoming request and delegating it to the correct specialist sub-agent.

### Implementing the Coordinator Pattern

1.  **Establish Hierarchy (`sub_agents`):** In the coordinator's YAML file, define the `sub_agents` key, linking to the configuration files of the specialist agents.
    ```yaml
    sub_agents:
      - config_path: billing_agent.yaml
      - config_path: tech_support_agent.yaml
    ```
2.  **The Key to Delegation (`description`):** Each sub-agent needs a clear `description` of its capabilities. The coordinator's LLM uses these descriptions to make an informed routing choice.
3.  **The Coordinator's `instruction`:** The coordinator's own `instruction` must explicitly tell the agent that its job is to delegate based on the user's request.
