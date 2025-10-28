# Module 11: Built-in Tools and Grounding

## Lab 11: Building a Research Assistant with Web Search

### Goal

In this lab, you will build a **Research Assistant** that can access up-to-date information from the internet. You will learn how to use the `GoogleSearchAgentTool` wrapper to combine web search with your own custom tools.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create research-assistant
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd research-assistant
    ```

### Step 2: Define the Agent and Tools

**Exercise:** Open `agent.py`. The custom tools have been provided for you. Your task is to complete the agent definition by instantiating the search tool and writing the agent's instructions.

```python
# In agent.py (Starter Code)

from datetime import datetime
from google.adk.agents import Agent
from google.adk.tools import FunctionTool, GoogleSearchAgentTool

# --- Custom Tools (Provided for you) ---

def format_research_notes(topic: str, findings: str) -> dict:
    """Formats research findings into a document."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    document = f"""
# Research Report: {topic}
Generated: {timestamp}

## Findings
{findings}
    """.strip()
    return {"status": "success", "document": document}

def extract_key_facts(text: str, num_facts: int = 5) -> list[str]:
    """Extract key facts from text (simplified)."""
    sentences = text.split('.')
    return [s.strip() for s in sentences if s.strip()][:num_facts]

# --- Agent Definition ---

# TODO: 1. Create an instance of the GoogleSearchAgentTool.
search_tool = None

# TODO: 2. Define the `root_agent`.
# TODO: 3. Add the `search_tool` and the two custom tools (`extract_key_facts`,
# `format_research_notes`) to the agent's `tools` list.
# TODO: 4. Write an instruction that tells the agent to perform the research
# workflow in the correct order: search -> extract -> format.
root_agent = Agent(
    model='gemini-1.5-flash',
    name='research_assistant',
    description='Conducts web research and compiles findings',
    instruction="""
    # Your instruction here...
    """,
    tools=[
        # Your tools here...
    ]
)
```

### Step 3: Run and Test the Research Assistant

1.  **Set up your `.env` file for Vertex AI.** The `google_search` tool requires a Vertex AI configuration.

2.  **Start the Dev UI:**
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "research_assistant".
    *   Give the agent a research topic, like "What are the latest developments in AI in 2025?"

4.  **Analyze the Trace View:**
    *   Expand the trace for your query. You should see a sequence of tool calls: `GoogleSearchAgentTool`, then `extract_key_facts`, then `format_research_notes`.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built an agent that can access real-world, current information from the internet and process it using custom logic. You have learned:
*   How to use the `GoogleSearchAgentTool` wrapper to combine built-in search with custom `FunctionTool`s.
*   How to write an instruction that orchestrates a sequence of different tool types.
