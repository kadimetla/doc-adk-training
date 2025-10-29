---
sidebar_position: 2
---
# Module 30: Building a Custom MCP Tool

## Lab 30: Building a "Shopping Cart" MCP Server

### Goal

In this lab, you will build your own simple, standalone MCP server from scratch. This server will manage a stateful shopping cart, allowing clients to add items and view the cart's contents. You will then connect an ADK agent to your custom server.

### Step 1: Install MCP and Create Project

1.  **Install the `mcp` library:**
    ```shell
    pip install mcp
    ```

2.  **Create a new project directory:**
    ```shell
    mkdir custom-mcp-server
    cd custom-mcp-server
    ```

### Step 2: Implement the MCP Server

**Exercise:** Create a file named `cart_server.py`. Inside this file, your task is to implement the `list_tools` and `call_tool` handlers for the shopping cart server. Use the `# TODO` comments as your guide.

```python
# In cart_server.py (Starter Code)
import asyncio
import json
from mcp import types as mcp_types
from mcp.server.lowlevel import Server
from mcp.server.models import InitializationOptions
import mcp.server.stdio

SESSION_CARTS = {}
app = Server("shopping_cart_mcp_server")

@app.list_tools()
async def list_mcp_tools() -> list[mcp_types.Tool]:
    """Defines the 'menu' of tools our server offers."""
    print("[Server]: Client asked for the list of tools.")
    
    # TODO: 1. Define the `add_item_to_cart` tool. It needs a name, a
    # description, and an inputSchema for a required string property "item".
    add_item_tool = mcp_types.Tool(...)

    # TODO: 2. Define the `view_cart` tool. It needs a name, a description,
    # and an empty inputSchema since it takes no arguments.
    view_cart_tool = mcp_types.Tool(...)
    
    return [add_item_tool, view_cart_tool]

@app.call_tool()
async def call_mcp_tool(name: str, arguments: dict, session_id: str) -> list[mcp_types.Content]:
    """Handles the execution of our tools."""
    print(f"[Server]: Client called tool '{name}' for session '{session_id}'.")

    if session_id not in SESSION_CARTS:
        SESSION_CARTS[session_id] = []

    # TODO: 3. Implement the logic for the "add_item_to_cart" tool.
    # - Get the "item" from the `arguments`.
    # - Append it to the correct session cart in `SESSION_CARTS`.
    # - Return a success message.

    # TODO: 4. Implement the logic for the "view_cart" tool.
    # - Get the current cart for the `session_id`.
    # - Return the cart contents.
    
    # Remember to return your response as a JSON string inside a
    # `mcp_types.TextContent` object.
    response_text = json.dumps({"status": "error", "message": "Not implemented."})
    return [mcp_types.TextContent(type="text", text=response_text)]

# --- MCP Server Runner (Provided for you) ---
async def run_mcp_stdio_server():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, InitializationOptions(server_name=app.name))

if __name__ == "__main__":
    asyncio.run(run_mcp_stdio_server())
```

### Step 3: Create the ADK Client Agent

Create an `agent.py` file and add the provided code to connect to your server.

```python
# In agent.py
import os
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool import MCPToolset, StdioConnectionParams
from mcp import StdioServerParameters

PATH_TO_SERVER = os.path.abspath("./cart_server.py")

root_agent = LlmAgent(
    model='gemini-1.5-flash',
    name='shopping_agent',
    instruction='You are a shopping assistant. Help the user by adding items to their cart and showing them their cart contents.',
    tools=[
        MCPToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command='python3',
                    args=[PATH_TO_SERVER],
                ),
            ),
        )
    ],
)
```
Also create an empty `__init__.py` and a `.env` file.

### Step 4: Test the Full System

1.  **Start the ADK web server:** `adk web`
2.  **Check the console logs:** You should see logs from your `cart_server.py` as it starts up.
3.  **Interact with the agent** in the Dev UI:
    *   "Please add 'milk' to my cart."
    *   "Also add 'eggs'."
    *   "What is in my shopping cart?"
4.  **Examine the server logs** in the console to see the `call_tool` requests being received and processed by your custom server.

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary
You have successfully built and consumed your own stateful MCP tool. You have learned to:
*   Implement the `@app.list_tools()` handler to define a server's tool schema.
*   Implement the `@app.call_tool()` handler to provide tool logic.
*   Manage state on the server side, tied to a `session_id`.
*   Connect an ADK agent to your custom-built MCP server.