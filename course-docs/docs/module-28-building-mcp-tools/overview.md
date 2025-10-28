
---
title: Building MCP Tools
---

## Module 28: Building a Custom MCP Tool

## Overview

### The Anatomy of an MCP Server

An MCP server must implement handlers for two fundamental methods:

#### 1. `list_tools()`
When a client connects, the server responds with a "menu" of all the tools it provides, including a detailed schema for each tool.

#### 2. `call_tool()`
When the client's LLM decides to use a tool, it sends a `call_tool()` request. The server's handler is responsible for executing the logic, managing any state associated with the `session_id`, and returning a result.

The `mcp` Python library provides a `Server` class and decorators (`@app.list_tools()`, `@app.call_tool()`) to simplify this process.
