---
sidebar_position: 3
---
## Module 28: Building a Custom MCP Tool

# Lab 28: Solution

# Lab 28: Solution

This file contains the complete code for both the `cart_server.py` and the `agent.py` client script for the Shopping Cart MCP lab.

### `custom-mcp-server/cart_server.py`

```python
# Filename: cart_server.py
import asyncio
import json
from mcp import types as mcp_types
from mcp.server.lowlevel import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio

# --- Server State ---
# In a real application, this would be a database. For this lab, a simple
# in-memory dictionary is enough to demonstrate statefulness.
SESSION_CARTS = {}

# --- MCP Server Setup ---
app = Server("shopping_cart_mcp_server")

@app.list_tools()
async def list_mcp_tools() -> list[mcp_types.Tool]:
    """Defines the 'menu' of tools our server offers."""
    print("[Server]: Client asked for the list of tools.")
    
    add_item_tool = mcp_types.Tool(
        name="add_item_to_cart",
        description="Adds a single item to the user's shopping cart.",
        inputSchema={
            "type": "object",
            "properties": {
                "item": {"type": "string", "description": "The item to add to the cart."}
            },
            "required": ["item"],
        },
    )
    
    view_cart_tool = mcp_types.Tool(
        name="view_cart",
        description="Shows all the items currently in the user's shopping cart.",
        inputSchema={"type": "object", "properties": {}}, # No arguments needed
    )
    
    return [add_item_tool, view_cart_tool]

@app.call_tool()
async def call_mcp_tool(name: str, arguments: dict, session_id: str) -> list[mcp_types.Content]:
    """Handles the execution of our tools."""
    print(f"[Server]: Client called tool '{name}' for session '{session_id}'.")

    # Ensure a cart exists for the current session
    if session_id not in SESSION_CARTS:
        SESSION_CARTS[session_id] = []

    # --- Tool Logic ---
    if name == "add_item_to_cart":
        item = arguments.get("item")
        if item:
            SESSION_CARTS[session_id].append(item)
            response_text = json.dumps({"status": "success", "message": f"Added '{item}' to the cart."}) 
        else:
            response_text = json.dumps({"status": "error", "message": "No item provided."})
        
        return [mcp_types.TextContent(type="text", text=response_text)]

    elif name == "view_cart":
        cart_contents = SESSION_CARTS[session_id]
        response_text = json.dumps({"status": "success", "cart": cart_contents})
        return [mcp_types.TextContent(type="text", text=response_text)]

    else:
        response_text = json.dumps({"status": "error", "message": f"Tool '{name}' not found."}) 
        return [mcp_types.TextContent(type="text", text=response_text)]

# --- MCP Server Runner ---
async def run_mcp_stdio_server():
    """Runs the server, listening for connections over standard input/output."""
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        print("[Server]: Waiting for a client to connect...")
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(server_name=app.name, server_version="0.1.0"),
        )
        print("[Server]: Client disconnected.")

if __name__ == "__main__":
    print("[Server]: Starting Shopping Cart MCP Server...")
    try:
        asyncio.run(run_mcp_stdio_server())
    except KeyboardInterrupt:
        print("\n[Server]: Shutting down.")
```

### `custom-mcp-server/agent.py`

```python
# Filename: agent.py
import os
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters

# Get the absolute path to our server script.
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