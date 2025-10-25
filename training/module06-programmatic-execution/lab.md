# Module 21: Running an Agent Programmatically

## Lab 21: Executing Your Agent in a Python Script

### Goal

In this lab, you will learn how to run an ADK agent programmatically from within a Python script, without using the `adk web` Dev UI. You will write a script that initializes a runner, creates a session, sends a query, and prints the streamed response to the console.

### Step 1: Prepare the Project

1.  **Create a new directory for this lab:**
    ```shell
    mkdir -p /path/to/your/adk-training/module21-programmatic-execution
    cd /path/to/your/adk-training/module21-programmatic-execution
    ```

2.  **Create the necessary files:**
    You will need an agent definition and a script to run it.
    ```shell
    touch agent.py __init__.py
    ```
    You will also need a `.env` file with your Google Cloud project details.

### Step 2: Define the Agent and Runner

You will now write the `agent.py` script. This script will contain all the logic to define, run, and interact with your agent.

**Exercise:** Open `agent.py` and fill it with the code provided in the `lab-solution.md`. Pay close attention to the numbered comments, which correspond to the key components of programmatic execution.

### Step 3: Run the Agent Script

Now that you have your agent, runner, and interaction logic in one script, you can execute it directly.

1.  **Ensure your environment is set up:**
    *   Make sure your virtual environment is active.
    *   Make sure your `.env` file is correctly configured with your `MODEL`.

2.  **Run the script:**
    ```shell
    uv run python agent.py
    ```

### Step 4: Observe the Output

You will see the output printed directly to your console, showing the user's query and the agent's streamed response:

```
** User says: {'role': 'user', 'parts': [{'text': 'What is the capital of France?'}]}
** trivia_agent: The capital of France is Paris.
```

### Lab Summary

You have successfully run an agent programmatically. This is the foundation for integrating your agent into any larger Python application.

You have learned to:
*   Instantiate an `InMemoryRunner` to manage agent execution.
*   Create a `Session` programmatically using the runner's `session_service`.
*   Package a user's message into the required `types.Content` and `types.Part` structure.
*   Use `runner.run_async` to execute the agent and loop through the streamed `Event` objects to get the response.
*   Structure the entire process within an `async` Python function.