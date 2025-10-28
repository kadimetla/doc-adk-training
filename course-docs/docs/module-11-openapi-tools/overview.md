
---
title: OpenAPI Tools
---

## Module 11: OpenAPI Tools

## Overview

### Connecting Your Agent to the Web

To connect your agent to existing web services and REST APIs, the ADK provides **OpenAPI Tools**.

### What is OpenAPI?

**OpenAPI** (formerly Swagger) is a standard specification for describing REST APIs. It's a machine-readable format that defines an API's endpoints, operations, and parameters.

### How `OpenAPIToolset` Works

The ADK's `OpenAPIToolset` class ingests an OpenAPI specification and **automatically generates** a complete set of tools that your agent can use.

**Benefits:**
*   **No Manual Tool Writing:** You don't need to write a Python function for every API endpoint.
*   **Always in Sync:** The generated tools always match the API specification.
*   **Automatic Handling:** The toolset handles HTTP request construction, validation, and response parsing.
