# Lab 13 Solution: Creating a "Memory" Agent with Tool Context

## Goal

This file contains the complete code for the `memory.py` and `agent.py` files in the Memory Agent lab.

### `memory-agent/tools/memory.py`

```python
from google.adk.tools import ToolContext

def remember_name(name: str, tool_context: ToolContext) -> dict:
    """
    Remembers the user's name by saving it to the session state.

    Use this tool when the user tells you their name.

    Args:
        name: The user's name to remember.
    
    Returns:
        A dictionary confirming the name was saved.
    """
    # The 'state' object in the tool_context is a dictionary-like object.
    # We can write to it directly.
    tool_context.state['user_name'] = name
    
    return {"status": "success", "message": f"I will remember that your name is {name}."}

def recall_name(tool_context: ToolContext) -> dict:
    """
    Recalls the user's name from the session state.

    Use this tool when the user asks you what their name is, or if you need
    to address them by name but don't have it in the immediate context.

    Returns:
        A dictionary containing the user's name or a message if it's not known.
    """
    # We use .get() to safely access the state, providing a default value.
    user_name = tool_context.state.get('user_name')
    
    if user_name:
        return {"status": "success", "name": user_name}
    else:
        return {"status": "not_found", "message": "I don't believe you've told me your name yet."}
```

### `memory-agent/agent.py` (Primary Solution)

```python
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool

# Import the functions from your tools module
from .tools.memory import remember_name, recall_name

# Create a FunctionTool for each function
remember_tool = FunctionTool(fn=remember_name)
recall_tool = FunctionTool(fn=recall_name)

root_agent = LlmAgent(
    name="memory_agent",
    model="gemini-2.5-flash",
    description="An agent that can remember and recall the user's name.",
    instruction="""
You are a friendly assistant with a memory.
- If the user tells you their name, you MUST use the `remember_name` tool to save it.
- If the user asks you what their name is, you MUST use the `recall_name` tool to find it.
- After recalling a name, address the user by their name.
""",
    tools=[
        remember_tool,
        recall_tool,
    ],
)
```

### `memory-agent/root_agent.yaml` (Alternative)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: memory_agent
model: gemini-2.5-flash
description: An agent that can remember and recall the user's name.
instruction: |
  You are a friendly assistant with a memory.
  - If the user tells you their name, you MUST use the `remember_name` tool to save it.
  - If the user asks you what their name is, you MUST use the `recall_name` tool to find it.
  - After recalling a name, address the user by their name.
tools:
  - name: tools.memory.remember_name
  - name: tools.memory.recall_name
```