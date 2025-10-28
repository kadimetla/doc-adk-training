
---
title: Custom Function Tools
---

## Module 9: Creating Custom Function Tools

## Overview

A custom function tool is a regular Python function that you make available to your agent.

### The Anatomy of a Well-Defined Tool Function

1.  **Descriptive Function Name:** `get_weather`, `calculate_loan_payment`.
2.  **Clear Parameters with Type Hints:** `def get_weather(city: str, is_forecast: bool):`
3.  **The All-Important Docstring:** This is the tool's description for the LLM. It should explain the tool's purpose, when to use it, and what each parameter represents.
4.  **Structured Return Value:** A tool function **must return a dictionary**, typically with a `status` key.
    ```python
    def get_weather(city: str) -> dict:
        """Fetches the current weather for a specific city."""
        # ... logic ...
        return {"status": "success", "report": "It is sunny."}
    ```
