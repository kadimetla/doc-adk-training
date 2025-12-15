---
sidebar_position: 3
title: "Lab Solution"
---

# Lab 39 Solution: Fixing a "Hallucinating" Agent with Plugins

## Goal

This solution demonstrates how to use the `ReflectAndRetryToolPlugin` to automatically recover from tool usage errors (like incorrect tool names) without modifying the agent's prompt code.

### `retry-agent/agent.py`

```python
from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google.adk.runner import Runner
from google.adk.plugins import ReflectAndRetryToolPlugin  # 1. Import
import asyncio

# The actual tool
def secret_calculator(a: int, b: int) -> int:
    """Adds two numbers."""
    return a + b

# The agent with MISLEADING instructions
agent = Agent(
    name="confused_agent",
    model="gemini-2.5-flash",
    # We lie to the agent about the tool name!
    instruction="You are a helper. To add numbers, you MUST use the tool named 'super_calc'. Do not use any other tool name.",
    tools=[FunctionTool(secret_calculator)]
)

async def main():
    # 2. Configure the Plugin
    # We give the agent 3 chances to realize its mistake and try the correct tool name.
    retry_plugin = ReflectAndRetryToolPlugin(max_retries=3)
    
    runner = Runner(
        agent=agent,
        # 3. Register the Plugin
        plugins=[retry_plugin]
    )
    
    print("User: What is 5 + 5?")
    # The run() method will now automatically handle the retry loop internally.
    result = await runner.run("What is 5 + 5?")
    print(f"Agent: {result.text}")
    
    # Optional: Verify the retry steps
    if hasattr(result, "trace"):
        print("\n--- Execution Trace ---")
        for step in result.trace:
            print(f"- {step}")

if __name__ == "__main__":
    asyncio.run(main())
```

### Self-Reflection Answers

1.  **Why is it better to handle this with a Plugin rather than just fixing the prompt in this specific scenario?**
    *   **Answer:** While fixing the prompt is ideal for *known* errors, the Plugin protects against *unknown* or *dynamic* errors. For example, if you have hundreds of tools, the model might occasionally hallucinate a name even with a perfect prompt. Or, the tool arguments might be slightly wrong (e.g., passing a string instead of an int). The Plugin provides a universal safety net for *all* tools and *all* types of execution errors, making the system robust against the inherent unpredictability of LLMs.

2.  **What would happen if we set `max_retries=0`?**
    *   **Answer:** The plugin would be effectively disabled. When the agent calls `super_calc`, the exception would propagate immediately, crashing the application (or returning an error to the user) without giving the agent a chance to correct itself.

3.  **How does this plugin help with "transient" errors, like a temporary network glitch in a tool?**
    *   **Answer:** If a tool fails due to a network glitch (e.g., raising a `ConnectionError`), the plugin catches it. It feeds the error ("Connection failed") back to the agent. The agent, seeing this, will likely decide to "try again" (retry the same tool call). If the glitch was temporary, the second attempt might succeed. This adds automatic resilience to your tools.
