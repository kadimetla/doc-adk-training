sidebar_position: 3
---
# Module 29: Introduction to MCP & Stateful Tools

# Lab 27: Solution

This file contains the complete code for the `agent.py` script in the Stateful File System Tool lab.

### `mcp-agent/agent.py`

```python
import os
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters

# -- Configuration --
# Get the absolute path to the 'test_files' directory we created.
# The MCP server needs an absolute path to know where to look.
TARGET_FOLDER_PATH = os.path.abspath("./test_files")

# -- Agent Definition --
root_agent = LlmAgent(
    model='gemini-1.5-flash',
    name='filesystem_agent',
    instruction='You are a helpful assistant that can interact with a user\'s local file system. You can list files and read their content.',
    tools=[
        # This is the bridge to the external MCP server.
        MCPToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    # The command to run the MCP server.
                    command='npx',
                    # Arguments for the command.
                    args=[
                        "-y",  # Auto-confirm 'npx' installation
                        "@modelcontextprotocol/server-filesystem", # The server package
                        TARGET_FOLDER_PATH, # The directory it should manage
                    ],
                ),
            ),
        )
    ],
)
```

```