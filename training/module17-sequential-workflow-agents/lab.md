# Module 17: Building Agent Pipelines with SequentialAgent

## Lab 17: Building a Blog Post Generator Pipeline

### Goal

In this lab, you will build a multi-step content creation pipeline using a `SequentialAgent`. This will demonstrate how to chain multiple specialist agents together, passing data from one to the next.

### The Pipeline Stages
1.  **Research Agent:** Gathers key facts about a topic.
2.  **Writer Agent:** Creates a draft blog post from the research.
3.  **Editor Agent:** Reviews the draft and suggests improvements.
4.  **Formatter Agent:** Applies the edits and formats the final post in Markdown.

### Step 1: Create the Project Structure

1.  **Create a new project:**
    ```shell
    adk create blog-pipeline
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd blog-pipeline
    ```

### Step 2: Assemble the Pipeline

**Exercise:** Open `agent.py`. The four specialist agents (`research_agent`, `writer_agent`, etc.) have been provided for you. Your task is to assemble them into a functioning pipeline.

```python
# In agent.py (Starter Code)

from __future__ import annotations
from google.adk.agents import Agent, SequentialAgent

# ===== Specialist Agents (Provided for you) =====

research_agent = Agent(
    name="researcher", model="gemini-2.5-flash",
    instruction="...", # Gathers facts
    output_key="research_findings"
)
writer_agent = Agent(
    name="writer", model="gemini-2.5-flash",
    instruction="...writes a draft based on {research_findings}...",
    output_key="draft_post"
)
editor_agent = Agent(
    name="editor", model="gemini-2.5-flash",
    instruction="...reviews the {draft_post}...",
    output_key="editorial_feedback"
)
formatter_agent = Agent(
    name="formatter", model="gemini-2.5-flash",
    instruction="...applies {editorial_feedback} to the {draft_post}...",
    output_key="final_post"
)

# ===== Create the Sequential Pipeline =====

# TODO: 1. Create a `SequentialAgent` named `blog_creation_pipeline`.
# TODO: 2. In the `sub_agents` list, add the four specialist agents
# in the correct logical order: research -> write -> edit -> format.
blog_creation_pipeline = None

# TODO: 3. The ADK requires a `root_agent` to be defined.
# Set the `root_agent` to be your `blog_creation_pipeline`.
root_agent = None
```
*(Note: The full agent instructions are in the `lab-solution.md` if you need to inspect them, but you don't need to change them for this exercise.)*

### Step 3: Run and Test the Pipeline

1.  **Set up your `.env` file.**
2.  **Navigate to the parent directory** (`cd ..`) and start the Dev UI:
    ```shell
    adk web blog-pipeline
    ```
3.  **Interact with the pipeline:**
    *   Send a topic to write about, like: "the history of the internet".
4.  **Examine the Trace and State Tabs:**
    *   **Trace View:** Expand the trace to see the `SequentialAgent` running its four sub-agents in order.
    *   **State View:** After the run, inspect the state to see the output of each step (`research_findings`, `draft_post`, etc.).

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built a deterministic, multi-agent pipeline. You have learned to:
*   Configure a `SequentialAgent` to orchestrate multiple sub-agents.
*   Understand how `output_key` and state variables (`{key}`) are used to pass data between agents in a sequence.
*   Analyze the execution of a pipeline using the Trace and State views.
