# Module 11: Built-in Tools and Grounding

# Lab 12: Solution

This file contains the complete code for the `agent.py` script in the Research Assistant lab.

### `research-assistant/agent.py`

```python
"""
Research Assistant with Web Grounding
Searches web, extracts key information, provides citations.
"""

from datetime import datetime
from google.adk.agents import Agent
from google.adk.tools import FunctionTool, GoogleSearchAgentTool

# --- Custom Tools ---

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
    # Filter out empty strings that may result from splitting
    return [s.strip() for s in sentences if s.strip()][:num_facts]

# --- Agent Definition ---

# Create search tool (using workaround for mixing with custom tools)
search_tool = GoogleSearchAgentTool()

# Create research assistant
root_agent = Agent(
    model='gemini-1.5-flash',
    name='research_assistant',
    description='Conducts web research and compiles findings',
    instruction="""
You are an expert research assistant with access to:
1. Web search via search_tool
2. Fact extraction via extract_key_facts
3. Note formatting via format_research_notes

When given a research topic:
1. Use search_tool to find current information.
2. Extract key facts using extract_key_facts.
3. Format the research using format_research_notes.
4. Present the final, formatted document to the user as your answer.
    """.strip(),
    tools=[
        search_tool,
        FunctionTool(extract_key_facts),
        FunctionTool(format_research_notes)
    ]
)
```
