---
sidebar_position: 1
---
# Module 29: Introduction to UI Integration

## Theory

### Why UI Integration Matters

While agents can be run from the command line or via an API, their full potential is unlocked when they are integrated into a user interface. A UI makes your agent accessible to non-technical users and enables rich, interactive experiences.

### The UI Integration Landscape

The ADK is flexible and supports several approaches for UI integration, each suited for different use cases:

| Approach | Best For | Key Features |
| :--- | :--- | :--- |
| **AG-UI Protocol** | Modern web apps (React/Next.js) | Pre-built components, official support |
| **Native ADK API** | Custom frameworks (Vue, Angular) | Full control, no dependencies |
| **Direct Python** | Data apps (Streamlit) | In-process, no HTTP overhead |
| **Messaging Platforms**| Team bots (Slack, Teams) | Native platform UX |
| **Event-Driven** | High-scale, async workflows | Decoupled, scalable (Pub/Sub) |

### Understanding the AG-UI Protocol

**AG-UI (Agent-Generative UI)** is an open protocol for agent-user interaction, developed through an **official partnership between the Google ADK and CopilotKit teams**. It provides a standardized, event-based way for AI agents to communicate with web UIs.

**The Stack:**
```text
+---------------------------------+
|   Frontend (React/Next.js)      |
| - @copilotkit/react-core (SDK)  |
| - <CopilotChat> (UI Component)  |
+---------------------------------+
                | (WebSocket/SSE)
+---------------------------------+
|   Backend (Python/FastAPI)      |
| - ag_ui_adk (Protocol Adapter)  |
| - Your ADK Agent                |
+---------------------------------+
```

By using the AG-UI protocol and the associated libraries, you can quickly build a production-ready chat interface with minimal front-end code, as the pre-built components handle the complexities of state management and streaming.
