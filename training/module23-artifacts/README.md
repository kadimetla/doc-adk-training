---
sidebar_position: 1
title: Overview
---

# Module 23: Handling Files with Artifacts

## Theory

### Why Artifacts Matter

Agents often need to create and persist files (reports, data, images) that live beyond a single conversation. Simple state is not enough for this; you need a proper file management system. The ADK provides this through **Artifacts**.

Artifacts provide structured file storage with powerful features that are critical for production agents:

*   💾 **Persistence**: Files survive across agent sessions.
*   📝 **Versioning**: Every time a file is saved, a new version is created automatically, providing a complete history.
*   🔍 **Discoverability**: Agents can list and search for all available artifacts.
*   📊 **Audit Trail**: The version history allows you to track who created what and when.
*   🔐 **Credentials**: A related system provides secure storage for secrets like API keys.

### The Artifact System

An **artifact** is a versioned file stored by the agent system. Each `save` operation creates a new, immutable version, and all previous versions are retained.

**Artifact Structure:**
```text
+--------------------------------------------------+
|                 ARTIFACT SERVICE                 |
+--------------------------------------------------+
|                                                  |
|  +------------------+     +--------------------+ |
|  |   Filename       |     |  Version History   | |
|  |  "report.txt"    |---->|   v0, v1, v2, ...  | |
|  +------------------+     +--------------------+ |
|           |                        |             |
|           v                        v             |
|  +------------------+     +--------------------+ |
|  |   Content        |     |      Metadata      | |
|  |  (types.Part)    |     | (Author, Timestamp)| |
|  +------------------+     +--------------------+ |
+--------------------------------------------------+
```
**Important:** Artifact versions are **0-indexed**. The first save of a file creates version 0.

### Configuring Artifact Storage

Before using artifacts, you must configure an `artifact_service` in your `Runner`.

*   **`InMemoryArtifactService`**: The default for local development. It stores files in memory and they are lost when the application restarts.
*   **`GcsArtifactService`**: The production-ready solution. It stores artifacts securely and persistently in a Google Cloud Storage bucket.

```python
# For local dev
from google.adk.artifacts import InMemoryArtifactService
artifact_service = InMemoryArtifactService()

# For production
from google.adk.artifacts import GcsArtifactService
artifact_service = GcsArtifactService(bucket_name='your-gcs-bucket')

# Add to runner
runner = Runner(
    agent=root_agent,
    artifact_service=artifact_service
    # Other services (session, memory) can also be configured here
)
```

### How Agents and Tools Interact with Artifacts

The primary way to work with artifacts is from within an **asynchronous custom tool** using the `ToolContext`. All artifact operations are `async` and must be `await`ed.

*   **`await tool_context.save_artifact(filename, artifact)`**: Saves a `types.Part` object as a new version of a file and returns the new version number.
*   **`await tool_context.load_artifact(filename, version=None)`**: Loads the content of an artifact. If `version` is omitted, it loads the latest version.
*   **`await tool_context.list_artifacts()`**: Returns a list of all artifact filenames available in the current session.

### Credential Management

While you can store simple secrets in the session state, the ADK provides a more secure, dedicated system for sensitive data like API keys and OAuth tokens.

*   **`await context.save_credential(auth_config)`**
*   **`await context.load_credential(auth_config)`**

This system uses a more complex `AuthConfig` object and is designed for production scenarios requiring robust security. For many use cases, storing simple API keys in the `user:` or `app:` state is a sufficient and simpler alternative.

### Key Takeaways
- The ADK's **Artifacts** system provides persistent, versioned file storage for agents.
- Artifacts are essential for tasks that require creating and managing files like reports, data, or images.
- **Versioning and Auditability:** The automatic versioning of artifacts is crucial for production environments. It provides a complete audit trail, allowing you to trace changes, debug errors by reverting to previous states, and ensure compliance by having a verifiable history of all generated files.
- You must configure an `artifact_service` in your `Runner`, using `InMemoryArtifactService` for development and `GcsArtifactService` for production.
- Tools interact with artifacts asynchronously using the `ToolContext`, with methods like `save_artifact`, `load_artifact`, and `list_artifacts`.
- **Asynchronous Operations:** All interactions with the Artifact Service (e.g., `save_artifact`, `load_artifact`) are asynchronous (`async`). This is because file I/O operations, especially with cloud storage services like GCS, can be time-consuming. Using `async` ensures that the main Python thread remains non-blocking, allowing the agent to handle other tasks or requests concurrently while waiting for file operations to complete.