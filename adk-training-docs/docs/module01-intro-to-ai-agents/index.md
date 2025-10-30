---
id: module01-overview
title: 'Module 1: Introduction to AI Agents & Google ADK'
description: 'Understand the foundational concepts of AI agents, the Google Agent Development Kit (ADK), and the core mental models for building intelligent systems.'
sidebar_label: '01: Overview'
sidebar_position: 1
keywords:
  [
    'AI Agents',
    'Google ADK',
    'Agent Development Kit',
    'Generative AI',
    'LLM',
    'Mental Models',
  ]
image: /img/docusaurus-social-card.jpg
---

**🎯 Purpose**: To establish a foundational mental model of what an AI agent is and to introduce the core components of the Google Agent Development Kit (ADK).

---

## [BRAIN] Core Mental Model: The Agent as a Digital Worker

Think of an AI agent not just as a chatbot, but as a digital worker you can hire to perform complex tasks.

```text
┌───────────────────────────────────────────────────────────────┐
│                        AI AGENT (Digital Worker)              │
│                                                               │
│  [BRAIN] LLM (Gemini)         [MEM] MEMORY (State)            │
│  - Understands goals         - Remembers conversation history │
│  - Reasons and plans                                          │
│                                                               │
│  [TOOLS] CAPABILITIES       [INSTR] INSTRUCTIONS (Job Manual) │
│  - Search the web            - Defines persona and rules      │
│  - Access databases          - Guides the task                │
│  - Run code                                                   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Key Insight**: An agent is a system that combines a **brain** (the LLM) with **tools** (its capabilities) and follows **instructions** (your prompt) to achieve a goal.

---

## 🏗️ Foundational Concepts

### What is an AI Agent?

An AI Agent is a system that can:

1.  **Perceive:** Understand a user's request in natural language.
2.  **Reason & Plan:** Use an LLM to break down a goal into actionable steps.
3.  **Act:** Use tools (e.g., call an API, run code) to execute those steps.
4.  **Observe:** Analyze the results and adjust its plan until the goal is met.

### What is the Google Agent Development Kit (ADK)?

The ADK is a framework that provides all the necessary components to build, manage, and deploy these digital workers in a structured and scalable way.

#### Core Components of the ADK:

*   **Agent:** The worker itself (`LlmAgent`, `SequentialAgent`, etc.).
*   **Tool:** A specific skill or capability you give to the agent.
*   **Session & State:** The agent's short-term memory for a single conversation.
*   **Memory:** The agent's long-term memory across multiple conversations.
*   **Runner:** The engine that orchestrates the entire workflow.
*   **Evaluation:** A system for testing your agent's performance.
*   **Deployment:** Tools to deploy your agent to the cloud.

---

## 🎯 Lab 1: Challenge

The goal of this first lab is to familiarize yourself with the ADK ecosystem.

1.  **Navigate the Official Documentation:** Explore the "Get Started," "Agents," and "Tools" sections of this site.
2.  **Discover the Code Repositories:** Find the official "Google ADK Python" repository on GitHub and explore the `examples` directory.
3.  **Understand Community Channels:** Locate the "Issues" and "Discussions" tabs on the GitHub repository.

---

## 🎓 Lab 1: Solution

This lab is a conceptual exercise. A successful completion means you have:

*   Navigated the main sections of this documentation site.
*   Located the official ADK Python repository on GitHub: [https://github.com/google/adk-python](https://github.com/google/adk-python)
*   Found the code examples within the repository.
*   Understood where to find community support and report issues.