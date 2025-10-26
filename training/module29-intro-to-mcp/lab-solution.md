# Module 28: Introduction to MCP & Stateful Tools

## Lab 28: Solution

This file contains a more advanced, complete solution for a "Document Organizer" agent that uses the MCP filesystem server. This demonstrates a more realistic use case where the agent performs a multi-step task using the discovered tools.

### `mcp-agent/agent.py`

```python
"""
Document Organizer using MCP Filesystem Server
Automatically organizes documents by type, date, and content.
"""

import asyncio
import os
from google.adk.agents import Agent, Runner, Session
from google.adk.tools.mcp_tool import MCPToolset, StdioConnectionParams
from google.genai import types
from mcp import StdioServerParameters


class DocumentOrganizer:
    """Intelligent document organizer using MCP."""

    def __init__(self, base_directory: str):
        """
        Initialize document organizer.

        Args:
            base_directory: Root directory to organize
        """

        self.base_directory = base_directory

        # Create MCP toolset for filesystem access
        self.mcp_tools = MCPToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command='npx',
                    args=[
                        '-y',
                        '@modelcontextprotocol/server-filesystem',
                        base_directory
                    ]
                )
            ),
            retry_on_closed_resource=True  # Auto-retry on connection issues
        )

        # Create organizer agent
        self.agent = Agent(
            model='gemini-1.5-flash',
            name='document_organizer',
            description='Intelligent document organization agent',
            instruction="""
You are a document organization expert with filesystem access.

Your responsibilities:
1. Analyze files by name, type, and content.
2. Create logical folder structures (e.g., Documents, Images, Code).
3. Move files to appropriate locations.
4. Generate a summary report of all actions taken.

Guidelines:
- Never delete files.
- Preserve original filenames unless they are unclear.
- Always report all changes made.

You have access to filesystem tools discovered via MCP, including:
- read_file, write_file, list_directory, create_directory, move_file, search_files, get_file_info
            """.strip(),
            tools=[self.mcp_tools]
        )

        self.runner = Runner(agent=self.agent)
        self.session = Session()

    async def organize(self):
        """Organize documents in base directory."""

        print(f"ORGANIZING: {self.base_directory}")

        result = await self.runner.run_async(
            new_message=types.Content(role="user", parts=[types.Part(text="""
Organize all files in the directory. Start by listing the directory contents, then create folders and move files as needed. Finally, provide a summary report.
            """ )]),
            session=self.session
        )

        print("\nORGANIZATION REPORT:\n")
        print(result.content.parts[0].text)

# Note: To run this, you would need to create a `main` block like so:
#
# async def main():
#     # Create a dummy directory with some files to organize
#     if not os.path.exists("./docs_to_organize"):
#         os.makedirs("./docs_to_organize")
#     with open("./docs_to_organize/report.txt", "w") as f:
#         f.write("This is a report.")
#     with open("./docs_to_organize/image.jpg", "w") as f:
#         f.write("fake image data")
#
#     organizer = DocumentOrganizer(os.path.abspath("./docs_to_organize"))
#     await organizer.organize()
#
# if __name__ == '__main__':
#     from dotenv import load_dotenv
#     load_dotenv()
#     asyncio.run(main())

# The root_agent is the agent instance from the organizer
root_agent = DocumentOrganizer(os.path.abspath("./test_files")).agent
```

```
