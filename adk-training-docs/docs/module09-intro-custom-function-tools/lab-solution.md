---
id: module09-lab-solution
title: "Module 9: Lab Solution - Building a Calculator Agent"
description: "Provides the final code for the Calculator agent and its tools."
sidebar_label: "09: Lab Solution"
sidebar_position: 3
keywords: ["ADK", "solution", "custom tools", "calculator"]
image: /img/docusaurus-social-card.jpg
---
sidebar_label: Lab Solution
sidebar_position: 3
---
id: module09-lab-solution
title: "Module 9: Lab Solution - Building a Calculator Agent"
description: "Provides the final code for the Calculator agent and its tools."
sidebar_label: "09: Lab Solution"
sidebar_position: 3
keywords: ["ADK", "solution", "custom tools", "calculator"]
image: /img/docusaurus-social-card.jpg
---
sidebar_label: Lab Solution
# Module 8: Creating Custom Function Tools

# Lab 9: Solution

This file contains the complete, step-by-step guide to creating the "Calculator" agent.

### Goal

You will build an agent that can perform basic arithmetic by creating your own custom function tools in Python and integrating them into a config-based agent.

### Step 1: Create the Calculator Agent Project

1.  **Navigate to your training directory:**
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Create the agent project:**
    ```shell
    adk create --type=config calculator-agent
    ```

3.  **Navigate into the new directory:**
    ```shell
    cd calculator-agent
    ```

### Step 2: Write the Custom Tool Functions

1.  **Create a `tools` directory and package files:**
    ```shell
    mkdir tools
    touch tools/__init__.py
    ```

2.  **Create the `calculator.py` file:**
    Create `tools/calculator.py` and add the following code:

    ```python
    def add(a: int, b: int) -> dict:
        """
        Adds two numbers together.

        Use this tool when the user asks to find the sum of two numbers.

        Args:
            a: The first number.
            b: The second number.
        
        Returns:
            A dictionary with the result of the addition.
        """
        result = a + b
        return {"status": "success", "result": result}

    def subtract(a: int, b: int) -> dict:
        """
        Subtracts the second number from the first number.

        Use this tool when the user asks to find the difference between two numbers.

        Args:
            a: The first number.
            b: The second number to subtract.

        Returns:
            A dictionary with the result of the subtraction.
        """
        result = a - b
        return {"status": "success", "result": result}

    def multiply(a: int, b: int) -> dict:
        """
        Multiplies two numbers together.

        Use this tool when the user asks to find the product of two numbers.

        Args:
            a: The first number.
            b: The second number.

        Returns:
            A dictionary with the result of the multiplication.
        """
        result = a * b
        return {"status": "success", "result": result}

    def divide(a: int, b: int) -> dict:
        """
        Divides the first number by the second number.

        Use this tool when the user asks to divide one number by another.

        Args:
            a: The numerator.
            b: The denominator.

        Returns:
            A dictionary with the result or an error if division by zero occurs.
        """
        if b == 0:
            return {"status": "error", "message": "Cannot divide by zero."}
        result = a / b
        return {"status": "success", "result": result}
    ```

### Step 3: Configure the Agent to Use the Tools

1.  **Set up your environment variables** in the `.env` file.

2.  **Update the `root_agent.yaml` file:**
    Open `root_agent.yaml` and replace its contents with the following:

    ```yaml
    # yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
    name: calculator_agent
    model: gemini-1.5-flash
    description: An agent that can perform basic arithmetic calculations.
    instruction: |
      You are a helpful calculator assistant.
      When the user asks you to perform a calculation (add, subtract, multiply, or divide), you MUST use the appropriate tool.
      Clearly state the result of the calculation to the user.
      If the user asks a question that is not a calculation, politely state that you can only perform math.
    tools:
      - name: tools.calculator.add
      - name: tools.calculator.subtract
      - name: tools.calculator.multiply
      - name: tools.calculator.divide
    ```

### Step 4: Test the Calculator Agent

1.  **Start the web server:** `adk web`
2.  **Interact with the agent** in the Dev UI and ask it to perform calculations. Check the Trace View to see the tools being executed.
    *   "What is 42 + 118?"
    *   "Multiply 15 by 3."
    *   "What is 10 divided by 0?"
    *   "What is the capital of France?" (Should be gracefully declined).

# Lab Summary

You have successfully built an agent with custom capabilities, learning to:
*   Organize tool code into a separate Python module.
*   Write well-defined Python functions with type hints and docstrings to serve as tools.
*   Reference and register your custom tools in the `root_agent.yaml` configuration.
*   Write instructions that effectively guide the agent on how and when to use its new tools.
