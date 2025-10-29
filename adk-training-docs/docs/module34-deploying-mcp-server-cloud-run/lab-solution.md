---
sidebar_position: 3
---
## Module 34: Deploying an MCP Server to Cloud Run

## Lab 34: Solution

## Lab 34: Solution

This file contains the complete code for the `stateless_cart_server.py` and the `agent.py` client for the lab.

### `cloud-mcp-server/stateless_cart_server.py`

```python
# Filename: stateless_cart_server.py
import asyncio
import json
import os
from mcp import types as mcp_types
from mcp.server.lowlevel import Server
import mcp.server.http_stream

# --- Configuration ---
# In a serverless environment, we can use the temporary filesystem for a simple demo.
# In a real app, this would be a Redis or database connection.
STATE_STORAGE_PATH = "/tmp/carts"
if not os.path.exists(STATE_STORAGE_PATH):
    os.makedirs(STATE_STORAGE_PATH)

# --- MCP Server Setup ---
app = Server("stateless_shopping_cart_server")

# Helper functions to simulate an external state store
def get_cart(session_id: str) -> list:
    cart_file = os.path.join(STATE_STORAGE_PATH, f"{session_id}.json")
    if os.path.exists(cart_file):
        with open(cart_file, 'r') as f:
            return json.load(f)
    return []

def save_cart(session_id: str, cart: list):
    cart_file = os.path.join(STATE_STORAGE_PATH, f"{session_id}.json")
    with open(cart_file, 'w') as f:
        json.dump(cart, f)

@app.list_tools()
async def list_mcp_tools() -> list[mcp_types.Tool]:
    add_item_tool = mcp_types.Tool(name="add_item_to_cart", description="Adds an item to the cart.", inputSchema={"type": "object", "properties": {"item": {"type": "string"}}, "required": ["item"]})
    view_cart_tool = mcp_types.Tool(name="view_cart", description="Views items in the cart.", inputSchema={"type": "object", "properties": {}})
    return [add_item_tool, view_cart_tool]

@app.call_tool()
async def call_mcp_tool(name: str, arguments: dict, session_id: str) -> list[mcp_types.Content]:
    print(f"[Server]: Handling '{name}' for session '{session_id}'")
    cart = get_cart(session_id)

    if name == "add_item_to_cart":
        item = arguments.get("item")
        cart.append(item)
        save_cart(session_id, cart)
        response_text = json.dumps({"status": "success", "message": f"Added '{item}'."})
        return [mcp_types.TextContent(type="text", text=response_text)]

    elif name == "view_cart":
        response_text = json.dumps({"status": "success", "cart": cart})
        return [mcp_types.TextContent(type="text", text=response_text)]
    
    else:
        return [mcp_types.TextContent(type="text", text=json.dumps({"status": "error", "message": "Unknown tool."}))]

# --- Server Runner for HTTP ---
# This uses the HTTP stream runner, suitable for Cloud Run
main = mcp.server.http_stream.create_main(app)

if __name__ == "__main__":
    main()
```

### `cloud-mcp-server/agent.py`

```python
# Filename: agent.py
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from mcp import StreamableHTTPConnectionParams

# The URL of your deployed MCP server
# Replace this with the URL from your `gcloud run deploy` output
MCP_SERVER_URL = "YOUR_CLOUD_RUN_SERVICE_URL"

root_agent = LlmAgent(
    model='gemini-1.5-flash',
    name='cloud_shopping_agent',
    instruction='You are a shopping assistant. Help the user by adding items to their cart and showing them their cart contents.',
    tools=[
        MCPToolset(
            # Use StreamableHTTPConnectionParams for remote servers
            connection_params=StreamableHTTPConnectionParams(
                url=MCP_SERVER_URL,
            ),
        )
    ],
)
```
