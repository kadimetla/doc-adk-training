# Lab 6 Solution: Programmatic Execution with the ADK Runner

## Goal

In this lab, you learned how to run an ADK agent programmatically from within a Python script, using the standard `Runner`. You imported and ran the **Haiku Poet agent** you built in Module 4.

This demonstrated the canonical way to execute an agent as part of a larger Python application, without using the `adk` command-line tools.

### Step 1: Prepare the Project

1.  **Navigate to your `adk-training` directory:**
    This is the root directory containing all your agents.
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Create the main execution script:**
    In the `adk-training` directory, you created a new Python file named `run_haiku_agent.py`.

### Step 2: Complete the `run_haiku_agent.py` Script

Here is the complete `run_haiku_agent.py` script:

```python
import asyncio
from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import Session, InMemorySessionService
from google.genai import types

# Import the root_agent from your haiku-poet-agent directory.
from haiku_poet_agent import agent as haiku_agent_module

async def main():
    # Create a Session Service.
    session_service = InMemorySessionService()

    # Initialize the Runner, passing in the session service.
    runner = Runner(session_service=session_service)

    # Create a new session for your agent.
    session = await session_service.create_session(
        app_name="haiku-poet-agent",
        user_id="user123",
    )
    
    # Package your query.
    query_string = "A quiet morning with a cup of coffee."
    new_message = types.Content(
        parts=[types.Part(text=query_string)],
        role="user",
    )

    # Run the agent.
    async for event in runner.run_async(session=session, new_message=new_message):
        # Print the text from the final agent response.
        if event.name == "agent:response" and event.data.parts:
            for part in event.data.parts:
                if part.text:
                    print(part.text)

if __name__ == "__main__":
    asyncio.run(main())
```

### Step 3: Run the Script

Once you have completed the script, you can execute it directly from your terminal.

1.  **Ensure your virtual environment is active.**

2.  **Run the script from your `adk-training` directory:**
    ```shell
    python run_haiku_agent.py
    ```

### Step 4: Observe the Output

If your script is correct, you will see the haiku response printed directly to your console. For the example query, it might look something like this:

```
Steam gently does rise,
The world outside is quiet,
Warm mug in my hands.
```

### Lab Summary

You have successfully run an agent programmatically using the standard `Runner`. This is the foundation for integrating your agent into any larger Python application.

You have learned to:
*   Import an agent from a subdirectory as a Python module.
*   Instantiate an `InMemorySessionService` to manage session state.
*   Instantiate the `Runner` and provide it with the necessary services.
*   Create a `Session` programmatically for a specific agent app.
*   Use `runner.run_async` to execute the agent and process the event stream to get the final response.

### Self-Reflection Questions
- Why is it important to decouple the `Runner` from the `SessionService`? What advantage does this give you in a production environment?
- The `runner.run_async` method returns a stream of events. Why is this streaming approach useful in a real-world application compared to a function that just returns the final string?
- How would you modify this script to have a continuous conversation with the agent instead of just sending one message? (Hint: Think about loops and reusing the session object).
