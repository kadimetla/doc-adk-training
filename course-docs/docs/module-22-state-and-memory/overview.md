
---
title: State and Memory
---

## Module 22: State and Memory

## Overview

### Session State (`session.state`)

The agent's **scratchpad**—a key-value dictionary for conversation-level data.

**State Scoping with Prefixes**:

| Prefix  | Scope                   | Persistence              |
| ------- | ----------------------- | ------------------------ |
| None    | Current session         | SessionService dependent |
| `user:` | All sessions for user   | Persistent               |
| `app:`  | All users/sessions      | Persistent               |
| `temp:` | Current invocation only | **Never persisted**      |

### Memory Service

The Memory Service provides **long-term, searchable memory** for your agent, like an archive of past conversations. It allows an agent to query past conversations to provide more informed and personalized responses.
