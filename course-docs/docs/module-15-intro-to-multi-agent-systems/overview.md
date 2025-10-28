
---
title: Intro to Multi-Agent Systems
---

## Module 15: Introduction to Multi-Agent Systems

## Overview

### The Power of Specialization and Collaboration

A multi-agent system is an application where different, specialized agents collaborate to achieve a larger goal. Instead of one agent that does everything, you create a team of experts.

**Advantages:**

*   **Modularity:** Each agent is a self-contained unit with a clear purpose.
*   **Maintainability:** Changes to one agent don't break others.
*   **Reusability:** A well-defined specialist agent can be reused in other applications.

### How Agents Collaborate in the ADK

1.  **Hierarchy (`sub_agents`):** A parent agent can have a list of `sub_agents`.
2.  **LLM-Driven Delegation (Agent Transfer):** A parent `LlmAgent` can be instructed to analyze a request and then **transfer** control to the most appropriate `sub_agent`.
3.  **Shared State:** Agents can communicate passively by reading and writing to the shared `session.state`.
