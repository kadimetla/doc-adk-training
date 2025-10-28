
---
title: Deploying MCP Servers
---

## Module 34: Deploying an MCP Server to Cloud Run

## Overview

### The Challenge of State in a Serverless World

Cloud Run is a **stateless** environment. Each incoming request could be handled by a different container instance. An in-memory state (like a Python dictionary) will be lost between requests.

### The Solution: Externalized State

The solution is to **externalize the state**. Instead of storing session data in the server's memory, the server must save it to and load it from an external, persistent storage service that all instances can access, such as **Redis** or **Firestore**.
