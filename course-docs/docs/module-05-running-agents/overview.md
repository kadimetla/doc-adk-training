
---
title: Running Agents
---

## Module 5: Running and Interacting with Agents

## Overview

The ADK provides several ways to run your agent, each suited for different stages of development.

### 1. Interactive Development: `adk web`

This is your primary tool during development. It starts a local web server with the **ADK Developer UI**, which includes:

*   **Chat Interface:** For real-time interaction.
*   **Trace View:** A detailed, step-by-step visualization of your agent's execution flow, invaluable for debugging.
*   **Session Management:** To test multi-turn conversations.

### 2. Headless Interaction: `adk run`

This command allows you to interact with your agent directly from your terminal. It's a fast way to test a specific input or for use in automated testing scripts.

### 3. Deployment and Integration: `adk api_server`

This command runs your agent as a standalone HTTP server, exposing its functionality through a RESTful API. This is how you would typically run your agent in a production environment, allowing other applications to communicate with it programmatically.
