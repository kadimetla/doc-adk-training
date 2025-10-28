
---
title: Third-Party Tools
---

## Module 14: Integrating Third-Party Tools

## Overview

### The Wrapper Pattern

The ADK is designed with **interoperability** in mind. It allows you to use tools from other popular frameworks (like LangChain) directly within your ADK agent using special wrapper classes.

Here's how it works:

1.  You instantiate a tool from a third-party library (e.g., a Wikipedia tool from LangChain).
2.  You "wrap" this instance inside the corresponding ADK wrapper class (e.g., `LangchainTool`).
3.  You add the wrapped tool to your ADK agent's `tools` list.

The ADK wrapper handles all the translation, making the third-party tool look and feel like a native ADK tool to your agent. This saves development time and gives you access to a huge library of existing tools.
