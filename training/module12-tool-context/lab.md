# Module 12: Advanced Tool Concepts: Tool Context

## Lab 12: Creating a "Memory" Agent with Tool Context

### Goal

In this lab, you will build an agent that can remember and recall a piece of information using a custom tool. You will learn how to use the `ToolContext` object to read from and write to the session's state, giving your tool "memory."

### Step 1: Create the Memory Agent Project

1.  **Create the agent project:**
    ```shell
    adk create --type=config memory-agent
    cd memory-agent
    ```

2.  **Create the tools module:**
    ```shell
    mkdir tools
    touch tools/__init__.py
    touch tools/memory.py
    ```

### Step 2: Write the State-Aware Tool Functions

**Exercise:** Open `tools/memory.py`. A skeleton with two functions is provided. Your task is to implement the logic for each function using the `tool_context` to manage the agent's memory.

```python
# In tools/memory.py (Starter Code)

from google.adk.tools import ToolContext

def remember_name(name: str, tool_context: ToolContext) -> dict:
    """
    Remembers the user's name by saving it to the session state.
    Use this tool when the user tells you their name.
    Args:
        name: The user's name to remember.
    """
    # TODO: Use the tool_context to save the user's `name` to the
    # session state under the key 'user_name'.
    
    return {"status": "success", "message": f"I will remember that your name is {name}."}

def recall_name(tool_context: ToolContext) -> dict:
    """
    Recalls the user's name from the session state.
    Use this tool when the user asks you what their name is.
    """
    # TODO: Use the tool_context to get the 'user_name' from the state.
    # If the name exists, return it in a success dictionary:
    # {"status": "success", "name": user_name}
    # If it doesn't exist, return a "not_found" status:
    # {"status": "not_found", "message": "I don't believe you've told me your name yet."}
    pass
```

### Step 3: Configure the Agent

**Exercise:** Open `root_agent.yaml` and configure the agent to use your new tools.

```yaml
# In root_agent.yaml

# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: memory_agent
model: gemini-1.5-flash
description: An agent that can remember and recall the user's name.
instruction: |
  # TODO: Write an instruction that tells the agent:
  # - To use the `remember_name` tool when the user provides their name.
  # - To use the `recall_name` tool when the user asks what their name is.

# TODO: Add the `tools.memory.remember_name` and `tools.memory.recall_name` tools.
tools:
  - name: ...
```

### Step 4: Test the Memory Agent

1.  **Set up your `.env` file** and start the Dev UI: `adk web`
2.  **Interact with the agent:**
    *   **Turn 1:** "Hi, my name is Alex."
    *   **Turn 2:** "What is my name?"
3.  **Examine the Trace and State:**
    *   After the first turn, check the **State** tab to see if `user_name` was saved correctly.
    *   Check the **Trace** view for both turns to see the `remember_name` and `recall_name` tools being called.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have now created a tool with "memory"! You have learned to:
*   Access the `ToolContext` by adding it to a tool function's signature.
*   Write data to the session `state` using `tool_context.state['key'] = value`.
*   Read data from the session `state` using `tool_context.state.get('key')`.
*   Build an agent that can carry information across multiple turns of a conversation.