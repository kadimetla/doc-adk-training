
---
title: Artifacts
---

## Module 23: Handling Files with Artifacts

## Overview

### Why Artifacts Matter

**Artifacts** provide a structured file storage system for your agents, with features critical for production:

*   💾 **Persistence**: Files survive across agent sessions.
*   📝 **Versioning**: Every save creates a new version, providing a complete history.
*   🔍 **Discoverability**: Agents can list and search for available artifacts.

### How Agents Interact with Artifacts

The primary way to work with artifacts is from within an **asynchronous custom tool** using the `ToolContext`.

*   `await tool_context.save_artifact(filename, artifact)`
*   `await tool_context.load_artifact(filename, version=None)`
*   `await tool_context.list_artifacts()`
