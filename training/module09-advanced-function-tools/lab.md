# Module 9: Advanced Function Tools

## Lab 9: Building a Personal Finance Assistant

### Goal

In this lab, you will build a **Personal Finance Assistant** with multiple, complex function tools. This will go beyond the simple calculator and teach you how to create an agent capable of solving real-world financial math problems.

### Step 1: Create the Agent Project

1.  **Navigate to your training directory:**
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Create the agent project:**
    We will define this agent programmatically to handle the more complex tool logic.
    ```shell
    adk create finance-assistant
    ```
    When prompted, select the **Programmatic (Python script)** option. This will create a `finance-assistant` directory with `agent.py`, `__init__.py`, and `.env` files.

### Step 2: Configure the Environment

1.  **Navigate into the agent directory:**
    ```shell
    cd finance-assistant
    ```
2.  **Set up your API key** in the `.env` file as you did in previous labs.

### Step 3: Implement the Financial Tools

You will now create the Python functions that will serve as your agent's tools.

**Exercise:** Open `agent.py` and replace its contents with the code from the `lab-solution.md`. Your task is to read through and understand the three new tool functions:
1.  `calculate_compound_interest`
2.  `calculate_loan_payment`
3.  `calculate_monthly_savings`

Pay close attention to how each function:
*   Uses a detailed **docstring** to explain its purpose to the LLM.
*   Uses **type hints** (`principal: float`, `years: int`) for its parameters.
*   Performs **input validation** to handle invalid arguments.
*   Returns a **dictionary** with a `status` and a human-readable `report`.

### Step 4: Define the Agent and Register the Tools

At the bottom of `agent.py`, you will find the `root_agent` definition.

Notice how the three functions you just reviewed are passed directly into the `tools` list:
```python
root_agent = Agent(
    # ... (name, model, description, instruction)
    tools=[
        calculate_compound_interest, 
        calculate_loan_payment, 
        calculate_monthly_savings
    ]
)
```
The ADK automatically inspects these functions and makes them available to the LLM.

### Step 5: Run and Test Your Finance Assistant

1.  **Navigate to the parent directory** of your `finance-assistant` project.
    ```shell
    cd ..
    ```

2.  **Start the Dev UI:**
    ```shell
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "finance_assistant" from the dropdown.
    *   Test each of the agent's tools with natural language queries.

    **Try these prompts:**
    *   **Savings:** "If I invest $10,000 at 6% annual interest for 5 years, how much will I have?"
    *   **Loan:** "I want to buy a $300,000 house with a 30-year mortgage at 4.5% interest. What will my monthly payment be?"
    *   **Savings Goal:** "I want to save $50,000 for a down payment in 3 years. How much should I save each month?"
    *   **General Question:** "What's the difference between a Roth IRA and a traditional IRA?" (Notice the agent won't use a tool for this).

4.  **Explore the Events Tab:**
    After sending a query that uses a tool, click the "Events" tab in the Dev UI. You will see the `FunctionCall` from the LLM and the `FunctionResponse` from your Python code, allowing you to debug exactly what the agent is doing.

### Lab Summary

You have successfully built an advanced agent with multiple, complex function tools. You have learned:
*   How to write Python functions that can be used as ADK tools.
*   The importance of docstrings, type hints, and structured return values.
*   How to register multiple function tools with an agent.
*   How the LLM autonomously decides which tool to use based on the user's query.
*   How to use the Events tab to observe tool calls and responses.