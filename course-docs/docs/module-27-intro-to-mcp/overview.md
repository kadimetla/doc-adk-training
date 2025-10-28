
---
title: Introduction to MCP
---

## Module 27: Introduction to MCP & Stateful Tools

## Overview

### MCP: A Protocol for Stateful, Multi-turn Tools

The **Model Context Protocol (MCP)** is an open standard designed to allow AI agents to have rich, stateful conversations with external tools that need to maintain their own memory across multiple turns.

### The MCP Architecture: Client and Server

MCP works on a client-server model:

1.  **The MCP Server:** A standalone application that exposes a set of stateful tools.
2.  **The MCP Client:** The ADK agent acts as the client.

The `MCPToolset` is the bridge. It connects to an MCP server, discovers the tools it offers, and makes them available to your agent.
