---
sidebar_position: 2
---
# Module 8: Creating Custom Function Tools

## Lab 9: Exercise

### Goal

In this lab, you will build an agent that can perform basic arithmetic. You will do this by creating your own custom function tools in Python and integrating them into a config-based agent.

### Step 1: Create the Project and File Structure

1.  **Create the agent project:**
    ```shell
    adk create --type=config calculator-agent
    cd calculator-agent
    ```

2.  **Create the tools module:**
    It's good practice to organize your tool code in a separate module.
    ```shell
    mkdir tools
    touch tools/__init__.py
    touch tools/calculator.py
    ```

### Step 2: Implement the Tool Functions

**Exercise:** Open `tools/calculator.py` and implement the four arithmetic functions below. Pay close attention to the docstrings and type hints, as this is what the agent will see.

```python
# In tools/calculator.py

def add(a: int, b: int) -> dict:
    """
    Adds two numbers together.
    Use this tool when the user asks to find the sum of two numbers.
    Args:
        a: The first number.
        b: The second number.
    """
    # TODO: Calculate the sum of a and b.
    # Return a dictionary with {"status": "success", "result": ...}
    pass

def subtract(a: int, b: int) -> dict:
    """
    Subtracts the second number from the first number.
    Use this tool when the user asks to find the difference between two numbers.
    Args:
        a: The first number.
        b: The second number to subtract.
    """
    # TODO: Calculate the difference between a and b.
    # Return a dictionary with {"status": "success", "result": ...}
    pass

def multiply(a: int, b: int) -> dict:
    """
    Multiplies two numbers together.
    Use this tool when the user asks to find the product of two numbers.
    Args:
        a: The first number.
        b: The second number.
    """
    # TODO: Calculate the product of a and b.
    # Return a dictionary with {"status": "success", "result": ...}
    pass

def divide(a: int, b: int) -> dict:
    """
    Divides the first number by the second number.
    Use this tool when the user asks to divide one number by another.
    Args:
        a: The numerator.
        b: The denominator.
    """
    # TODO: Handle the case where b is 0, returning an error dictionary.
    # Otherwise, calculate the division and return the result.
    pass
```

### Step 3: Configure the Agent

**Exercise:** Open `root_agent.yaml` and complete the configuration. You need to write an instruction and tell the agent which tools it can use.

```yaml
# In root_agent.yaml

# yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
name: calculator_agent
model: gemini-1.5-flash
description: An agent that can perform basic arithmetic calculations.
instruction: |
  # TODO: Write an instruction that tells the agent it is a calculator.
  # It MUST use its tools to perform calculations.
  # It should politely decline non-mathematical questions.

# TODO: Add the four calculator tools you created.
# The format is `[directory_name].[file_name].[function_name]`.
tools:
  - name: ...
```

### Step 4: Test Your Agent

1.  **Set up your API key** in the `.env` file.
2.  **Start the web server:** `adk web`
3.  **Interact with the agent** in the Dev UI. Test all four operations, including division by zero. Check the Trace View to ensure your tools are being called correctly.

### Having Trouble?

If you get stuck, you can find the complete, working code and configuration in the `lab-solution.md` file.

### Lab Summary

You have successfully built an agent with custom capabilities! You have learned to:
*   Organize tool code into a separate Python module.
*   Write well-defined Python functions with type hints and docstrings to serve as tools.
*   Reference and register your custom tools in the `root_agent.yaml` configuration.
*   Write instructions that effectively guide the agent on how and when to use its new tools.