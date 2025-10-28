
---
title: Tool Context
---

## Module 13: Advanced Tool Concepts: Tool Context

## Overview

### Giving Tools "Situational Awareness"

The **`ToolContext`** is a special object that the ADK can automatically provide to your tool function, giving it access to the agent's runtime environment.

To access it, add `tool_context: ToolContext` to your tool function's signature.

### Key Capabilities of `ToolContext`

1.  **State Management (`tool_context.state`):** Gives your tool direct read and write access to the current conversation's `Session.state`. This is the primary way to create stateful tools that can remember information across turns.
    ```python
    # Write to state
    tool_context.state['last_order_id'] = 'XYZ-123'
    # Read from state
    last_order = tool_context.state.get('last_order_id')
    ```

2.  **Flow Control (`tool_context.actions`):** Allows your tool to influence the agent's workflow, for example, by transferring control to another agent (`transfer_to_agent`).

3.  **Accessing Files (`tool_context.load_artifact`):** Allows your tool to access files uploaded by the user.
