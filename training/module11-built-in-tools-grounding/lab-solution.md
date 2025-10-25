# Module 11: Built-in Tools and Grounding

## Lab 11: Solution

This file contains the complete code for the `agent.py` script in the Research Assistant lab.

### `research-assistant/agent.py`

```python
"""
Research Assistant with Web Grounding
Searches web, extracts key information, provides citations.
"""

import asyncio
import os
from datetime import datetime
from google.adk.agents import Agent, Runner
from google.adk.tools import google_search, FunctionTool, GoogleSearchAgentTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types

# --- Custom Tools ---

async def save_research_notes(
    topic: str,
    findings: str,
    tool_context: ToolContext
) -> str:
    """Save research findings as an artifact."""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    document = f"""
# Research Report: {topic}
Generated: {timestamp}

## Findings
{findings}
    """.strip()

    filename = f"research_{topic.replace(' ', '_')}.md"
    version = await tool_context.save_artifact(
        filename=filename,
        part=types.Part.from_text(document)
    )
    return f"Research saved as {filename} (version {version})"

def extract_key_facts(text: str, num_facts: int = 5) -> list[str]:
    """Extract key facts from text (simplified)."""
    sentences = text.split('.')
    return sentences[:num_facts]

# --- Agent Definition ---

# Create search tool (using workaround for mixing with custom tools)
search_tool = GoogleSearchAgentTool()

# Create research assistant
root_agent = Agent(
    model='gemini-2.5-flash',
    name='research_assistant',
    description='Conducts web research and compiles findings',
    instruction="""
You are an expert research assistant with access to:
1. Web search via search_tool
2. Fact extraction via extract_key_facts
3. Note saving via save_research_notes

When given a research topic:
1. Use search_tool to find current information.
2. Extract key facts using extract_key_facts.
3. Synthesize the findings into a clear summary.
4. Save the research using save_research_notes.
5. Provide the summary with key points to the user.
    """.strip(),
    tools=[
        search_tool,
        FunctionTool(extract_key_facts),
        FunctionTool(save_research_notes)
    ]
)
```