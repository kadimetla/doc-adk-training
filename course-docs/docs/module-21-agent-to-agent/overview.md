
---
title: Agent-to-Agent Communication
---

## Module 21: Agent-to-Agent Communication

## Overview

### Why A2A Matters

Agent-to-Agent (A2A) communication allows you to build scalable and robust **distributed systems** where specialized agents run as independent services and communicate over a network.

### The A2A System Architecture

A2A works on a client-server model where an "Orchestrator" agent delegates tasks to one or more remote "Specialist" agents.

### A2A in the ADK

1.  **Exposing an Agent (`to_a2a`):** The `to_a2a()` utility function wraps your agent in a standard web application that handles the A2A protocol.
2.  **Consuming a Remote Agent (`RemoteA2aAgent`):** The `RemoteA2aAgent` class allows your orchestrator to connect to and use a remote agent as if it were a local sub-agent.
