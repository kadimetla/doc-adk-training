---
sidebar_position: 1
title: Overview
---

# Module 22: State and Memory - Persistent Agent Context

## Theory

### Giving Agents Memory

A key feature that elevates a simple chatbot to a capable assistant is **memory**. The ADK provides a robust system for managing two different kinds of memory: short-term **State** and long-term **Memory**.

### Session State (`session.state`)

The agent's **scratchpad**—a key-value dictionary for conversation-level data.

**State Scoping with Prefixes**:

| Prefix  | Scope                   | Persistence              | Example Use Case                                             |
| ------- | ----------------------- | ------------------------ | ------------------------------------------------------------ |
| None    | Current session         | SessionService dependent | `state['current_topic'] = 'python'` - Task progress          |
| `user:` | All sessions for user   | Persistent               | `state['user:preferred_language'] = 'en'` - User preferences |
| `app:`  | All users/sessions      | Persistent               | `state['app:course_catalog'] = [...]` - Global settings      |
| `temp:` | Current invocation only | **Never persisted**      | `state['temp:quiz_score'] = 85` - Temporary calculations     |

> **Note on `temp:` State Visibility:** Although `temp:` state is never persisted beyond the current invocation, it is fully visible within the Event Stream and the Dev UI's Trace View during the agent's execution. This makes it a valuable tool for debugging intermediate calculations or temporary data flow within a single turn, even if the data is discarded afterwards.

**Key Points**:

- `temp:` state is **discarded** after the current turn completes.
- `user:` and `app:` require a persistent `SessionService` (like a database) to work across application restarts. The default `InMemorySessionService` will lose this data.
- State can be modified from tools via the `tool_context` and read in prompts using `{key}` syntax.

### Memory Service

The Memory Service provides **long-term, searchable memory** for your agent, like an archive of past conversations.

**Implementations**:

1.  **`InMemoryMemoryService`**: A simple, non-persistent keyword search for development and testing.
2.  **`VertexAiMemoryBankService`**: A production-grade, persistent service that uses semantic, LLM-powered search.

**Workflow**:

1.  After a meaningful conversation, you save the session to the memory service.
2.  In a future session, an agent can query the memory service (e.g., "What did I learn about Python functions before?").
3.  The service returns relevant excerpts from past conversations.
4.  The agent uses this retrieved context to provide a more informed and personalized response.

### Key Takeaways
- The ADK provides both short-term **State** and long-term **Memory** for agents.
- **Session State** is a key-value store with four scopes defined by prefixes: session (no prefix), `user:`, `app:`, and `temp:`.
- `user:` and `app:` prefixes enable persistent memory across sessions, but require a persistent `SessionService` in production.
- The **Memory Service** provides long-term, searchable storage for entire conversations, with `VertexAiMemoryBankService` offering powerful semantic search for production use.
