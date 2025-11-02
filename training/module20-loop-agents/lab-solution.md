# Lab 20 Solution: Building an Essay Refinement System

## Goal

This file contains the complete code for the `agent.py` script in the Essay Refinement System lab.

### `essay-refiner/agent.py`

```python
from __future__ import annotations

from google.adk.agents import Agent, LoopAgent, SequentialAgent
from google.adk.tools.tool_context import ToolContext

# ===== Exit Tool for Loop Termination =====
def exit_loop(tool_context: ToolContext):
    """
    Signal that the essay refinement is complete.
    Called by the refiner when critic approves the essay.
    """
    print(f"  [Exit Loop] Called by {tool_context.agent_name} - Essay approved!")
    tool_context.actions.end_of_agent = True  # Signal to stop looping
    # Return a minimal valid content part so the backend always produces a valid LlmResponse
    return {"text": "Loop exited successfully. The agent has determined the task is complete."}

# =====================================================
# PHASE 1: Initial Writer (Runs ONCE before loop)
# =====================================================
initial_writer = Agent(
    name="InitialWriter",
    model="gemini-2.5-flash",
    description="Writes the first draft of an essay",
    instruction=(
        "You are a creative writer. Write a first draft essay on the topic "
        "requested by the user.\n"
        "\n"
        "Write 3-4 paragraphs:\n"
        "- Opening paragraph with thesis\n"
        "- 1-2 body paragraphs with supporting points\n"
        "- Concluding paragraph\n"
        "\n"
        "Don't worry about perfection - this is just the first draft.\n"
        "\n"
        "Output ONLY the essay text, no meta-commentary."
    ),
    output_key="current_essay"  # Saves to state
)

# =====================================================
# PHASE 2: Refinement Loop (Runs REPEATEDLY)
# =====================================================

# ===== Loop Agent 1: Critic =====
critic = Agent(
    name="Critic",
    model="gemini-2.5-flash",
    description="Evaluates essay quality and provides feedback",
    instruction=(
        "You are an experienced essay critic and teacher. Review the essay below "
        "and evaluate its quality.\n"
        "\n"
        "**Essay to Review:**\n"
        "{current_essay}\n"
        "\n"
        "**Evaluation Criteria:**\n"
        "- Clear thesis and organization\n"
        "- Strong supporting arguments\n"
        "- Good grammar and style\n"
        