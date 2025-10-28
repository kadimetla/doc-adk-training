
---
title: Introduction to Tools
---

## Module 8: Introduction to Tools

## Overview

### Beyond Conversation

**Tools** are what give your agent superpowers, allowing it to break out of the conversational box and interact with external systems to fetch real-time information or perform actions.

### How Agents Use Tools (Function Calling)

1.  **User Request:** The user gives the agent a prompt (e.g., "What's the weather in Paris?").
2.  **Reasoning and Selection:** The agent's LLM analyzes the request and selects the appropriate tool (e.g., `get_weather`).
3.  **Invocation:** The LLM generates a structured "function call," specifying the tool name and arguments (`city="Paris"`).
4.  **Execution:** The ADK framework executes the tool's code and captures the result.
5.  **Observation and Final Response:** The result is sent back to the LLM, which formulates a natural language response.

### Types of Tools in ADK

1.  **Built-in Tools:** Ready-to-use tools like `google_search`.
2.  **Custom Function Tools:** Python functions you write and make available to your agent.
3.  **Third-Party Tools:** Integrations with tools from other frameworks like LangChain.
