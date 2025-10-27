# Module 6: Running an Agent Programmatically

## Lab 6: Executing Your Agent in a Python Script

### Goal

In this lab, you will learn how to run an ADK agent programmatically from within a Python script, without using the `adk web` Dev UI. You will write a script that initializes a runner, creates a session, sends a query, and prints the streamed response to the console.

### Step 1: Prepare the Project

1.  **Navigate to the lab directory:**
    ```shell
    cd training/module06-programmatic-execution
    ```

2.  **Inspect the files:**
    You will find an `agent.py` file. This is where you will write your code.

### Step 2: Complete the `agent.py` Script

You will now complete the `agent.py` script. It has been started for you, but you need to fill in the core logic.

**Exercise:** Open `agent.py` and complete the script by following the `# TODO` comments. The goal is to create and run a simple trivia agent.

```python
import asyncio
from google.adk.agents import Agent
from google.adk.runners import InMemoryRunner
from google.adk.sessions import Session
from google.genai import types
import os
from dotenv import load_dotenv

# Load environment variables from the agent directory's .env file
load_dotenv()
model_name = os.getenv("MODEL")

async def main():
    # TODO: Step 1 - Define your Agent configuration.
    # Give it the name "trivia_agent" and the instruction "Answer questions."

    # TODO: Step 2 - Create an InMemoryRunner with your agent.
    # Use the app_name 'my_agent_app'.

    # TODO: Step 3 - Create a new session using the runner's session_service.
    # Use the user_id 'user1'.

    # TODO: Step 4 - Package a query (e.g., "What is the capital of France?")
    # into a genai.types.Content object.

    # TODO: Step 5 - Call the runner.run_async() method with the session
    # and new message.

    # TODO: Step 6 - Loop through the events and print the text from
    # the final agent response.

if __name__ == "__main__":
    asyncio.run(main())
```

### Step 3: Run the Agent Script

Once you have completed the script, you can execute it directly from your terminal.

1.  **Ensure your environment is set up:**
    *   Make sure your virtual environment is active.
    *   Make sure you have a `.env` file in the `adk-docs` root with your `MODEL` defined.

2.  **Run the script:**
    ```shell
    uv run python agent.py
    ```

### Step 4: Observe the Output

If your script is correct, you will see the output printed directly to your console, showing the agent's response:

```
** trivia_agent: The capital of France is Paris.
```

### Having Trouble?

If you get stuck, you can find the complete code in the `lab-solution.md` file.

### Lab Summary

You have successfully run an agent programmatically. This is the foundation for integrating your agent into any larger Python application.

You have learned to:
*   Instantiate an `InMemoryRunner` to manage agent execution.
*   Create a `Session` programmatically using the runner's `session_service`.
*   Package a user's message into the required `types.Content` and `types.Part` structure.
*   Use `runner.run_async` to execute the agent and loop through the streamed `Event` objects to get the response.
*   Structure the entire process within an `async` Python function.
