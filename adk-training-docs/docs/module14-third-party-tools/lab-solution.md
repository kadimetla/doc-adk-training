# Module 13: Integrating Third-Party Tools

# Lab 14: Solution

This file contains the complete code for the `agent.py` file in the Fact-finder Agent lab.

### `fact-finder-agent/agent.py`

```python
from google.adk.agents import LlmAgent
from google.adk.tools.langchain_tool import LangchainTool
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

# 1. According to LangChain documentation, instantiate the tool.
# This sets up the connection to the Wikipedia API.
api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=2000)
langchain_tool_instance = WikipediaQueryRun(api_wrapper=api_wrapper)

# 2. Wrap the LangChain tool instance with the ADK's LangchainTool wrapper.
# The wrapper automatically inspects the tool and creates the schema for the LLM.
wikipedia_tool = LangchainTool(tool=langchain_tool_instance)

# 3. Define the ADK agent and include the wrapped tool in its tools list.
root_agent = LlmAgent(
    name="fact_finder_agent",
    model="gemini-1.5-flash",
    description="An agent that can look up information on Wikipedia.",
    instruction="""You are a helpful fact-finding assistant.
If the user asks a question about a specific topic, person, or event, you MUST use the Wikipedia tool to find an accurate answer.
Summarize the information you find in a clear and concise way.""",
    tools=[wikipedia_tool]
)
```

### Running the Agent

Because this agent is defined in a Python file, you must delete the placeholder `root_agent.yaml` file from the project directory before running `adk web`.
