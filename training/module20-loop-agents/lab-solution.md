# Lab 20 Solution: Building an Essay Refinement System

## Goal

This file contains the complete code for the `agent.py` script in the Essay Refinement System lab.

### `essay-refiner/agent.py`

```python
from __future__ import annotations

from google.adk.agents import Agent, LoopAgent, SequentialAgent
from google.adk.tools.tool_context import ToolContext
from google.adk.tools import FunctionTool

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
        "\n"
        "If the essay is excellent and meets all criteria, simply output: 'APPROVED'\n"
        "\n"
        "If improvements are needed, provide a short list of specific critiques "
        "that the writer should address in the next revision.\n"
        "\n"
        "Output ONLY your critique or 'APPROVED'."
    ),
    output_key="critique"  # Saves critique to state
)

# ===== Loop Agent 2: Refiner =====
refiner = Agent(
    name="Refiner",
    model="gemini-2.5-flash",
    description="Improves essay based on critique or exits loop",
    instruction=(
        "You are a specialized editor. Your job is to improve the essay based "
        "on the critic's feedback.\n"
        "\n"
        "**Current Essay:**\n"
        "{current_essay}\n"
        "\n"
        "**Critic's Feedback:**\n"
        "{critique}\n"
        "\n"
        "Instructions:\n"
        "1. If the feedback is exactly 'APPROVED', you MUST call the `exit_loop` tool immediately. Do not modify the essay.\n"
        "2. If there is feedback, rewrite the essay to address the specific points raised by the critic.\n"
        "\n"
        "If rewriting, output ONLY the full, revised essay text."
    ),
    tools=[FunctionTool(exit_loop)],
    output_key="current_essay"  # OVERWRITES the old essay with the new version!
)

# ===== Create Refinement Loop =====
refinement_loop = LoopAgent(
    name="RefinementLoop",
    sub_agents=[critic, refiner],
    max_iterations=5,  # Safety net: stop after 5 loops to prevent infinite running
    description="Iteratively critiques and refines the essay"
)

# =====================================================
# COMPLETE SYSTEM
# =====================================================

# ===== Create Sequential Pipeline =====
essay_refinement_system = SequentialAgent(
    name="EssayRefinementSystem",
    sub_agents=[
        initial_writer,   # Step 1: Create Draft
        refinement_loop   # Step 2: Improve Draft until perfect
    ],
    description="Full essay writing system with iterative refinement"
)

# MUST be named root_agent for ADK
root_agent = essay_refinement_system
```

### Self-Reflection Answers

1.  **Why is the `max_iterations` parameter a crucial safety feature for a `LoopAgent`? What could go wrong without it?**
    *   **Answer:** LLMs are non-deterministic. It is possible for the `critic` and `refiner` to get stuck in an endless cycle where the critic is never satisfied ("infinite loop"). Without `max_iterations`, the agent would run forever, consuming API credits and time, until the system crashed or timed out. The `max_iterations` parameter guarantees that the loop will eventually stop, even if the logical exit condition is never met.

2.  **In our "Critic -> Refiner" pattern, the `refiner` agent overwrites the `current_essay` in the state on each iteration. Why is this overwriting behavior essential for the loop to work correctly?**
    *   **Answer:** The goal is *iterative improvement*. Each time the loop runs, we want the agents to work on the *latest, best version* of the essay, not the original draft. By overwriting `current_essay`, the Refiner ensures that in the next iteration, the Critic will evaluate the *revised* version. If we didn't overwrite it, the Critic would just critique the same original draft over and over again.

3.  **Can you think of another problem, besides writing an essay, that could be solved effectively using a `LoopAgent` with a "Critic -> Refiner" pattern?**
    *   **Answer:**
        *   **Code Generation:** Writer generates code -> Critic runs tests/linters -> Refiner fixes errors -> Loop until tests pass.
        *   **Translation:** Writer translates text -> Critic checks for nuance/accuracy -> Refiner adjusts phrasing.
        *   **Plan Generation:** Planner proposes a schedule -> Critic checks for conflicts -> Refiner adjusts times.

```