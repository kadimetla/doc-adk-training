# Lab 35 Solution: Deploying an Agent to Agent Engine

## Goal

This lab is a procedural tutorial. The solution for both parts is a successfully deployed Agent Engine instance.

---
sidebar_position: 3

### Part 1: Accelerated Deployment Solution

After running `make backend`, a successful run of the command is the primary indicator of success.

**Expected Outcome:**
*   The `make backend` command completes without errors in your terminal.
*   A new agent with the name you configured appears in the **Vertex AI -> Agent Engine** section of the Google Cloud Console.
*   You can copy the **Agent Engine ID** from the console to use with a client application.

---
sidebar_position: 3

### Part 2: Standard Deployment Solution

This section contains the complete code for the `deploy.py` and `interact.py` scripts used in the manual deployment part of the lab.

#### `multi_tool_agent/agent.py`

This file should be the `agent.py` from the Python Quickstart. It is included here for completeness.

```python
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool
import random

def roll_die(sides: int, count: int = 1) -> dict:
    """Rolls a die with a specified number of sides, multiple times."""
    rolls = [random.randint(1, sides) for _ in range(count)]
    return {"rolls": rolls}

def check_prime(number: int) -> dict:
    """Checks if a number is prime."""
    if number < 2:
        is_prime = False
    else:
        is_prime = all(number % i != 0 for i in range(2, int(number**0.5) + 1))
    return {"is_prime": is_prime}

root_agent = LlmAgent(
    model="gemini-2.5-flash",
    name="multi_tool_agent",
    instruction="You roll dice and answer questions about prime numbers.",
    tools=[
        FunctionTool(fn=roll_die),
        FunctionTool(fn=check_prime),
    ],
)
```

#### `deploy.py`

```python
import vertexai
from vertexai import agent_engines
from multi_tool_agent.agent import root_agent

# --- CONFIGURATION ---
sidebar_position: 3
# Note: Replace these with your actual Google Cloud project details.
PROJECT_ID = "your-gcp-project-id"
LOCATION = "us-central1"
STAGING_BUCKET = "gs://your-unique-bucket-name"
AGENT_DISPLAY_NAME = "my-multi-tool-agent"

def main():
    # Initialize Vertex AI SDK
    vertexai.init(project=PROJECT_ID, location=LOCATION, staging_bucket=STAGING_BUCKET)

    # Prepare the agent for deployment by wrapping it in an AdkApp
    print("Wrapping agent in AdkApp...")
    app = agent_engines.AdkApp(
        agent=root_agent,
        enable_tracing=True
    )

    # Deploy to Agent Engine
    print(f"Deploying '{AGENT_DISPLAY_NAME}' to Agent Engine...")
    remote_app = agent_engines.create(
        agent_engine=app,
        display_name=AGENT_DISPLAY_NAME,
        requirements=["google-cloud-aiplatform[adk,agent_engines]>=1.111"],
    )

    print(f"Deployment complete. Resource Name: {remote_app.resource_name}")
    print(f"Agent Engine ID: {remote_app.resource_name.split('/')[-1]}")

if __name__ == "__main__":
    main()
```

#### `interact.py`

```python
import asyncio
import vertexai
from vertexai import agent_engines

# --- CONFIGURATION ---
sidebar_position: 3
# Note: Replace these with your actual Google Cloud project details.
PROJECT_ID = "your-gcp-project-id"
LOCATION = "us-central1"
# Note: Replace this with the ID output by the deploy.py script.
AGENT_ENGINE_ID = "YOUR_AGENT_ENGINE_ID" 

async def main():
    vertexai.init(project=PROJECT_ID, location=LOCATION)

    # Get a reference to the deployed agent
    remote_app = agent_engines.get(AGENT_ENGINE_ID)

    # Create a new session
    print("Creating new session...")
    remote_session = await remote_app.async_create_session(user_id="test-user-123")

    # Send a query and stream the response
    query = "Roll a 20-sided die 3 times."
    print(f"\nUser: {query}")
    print("Agent: ", end="")
    
    final_response = ""
    async for event in remote_app.async_stream_query(
        session_id=remote_session["id"],
        message=query,
    ):
        # Look for the final text part in the model's response
        if (
            event.get("content", {}).get("parts", [{}])[0].get("text")
            and not event.get("content", {}).get("parts", [{}])[0].get("function_call")
        ):
            final_response = event["content"]["parts"][0]["text"]

    print(final_response)

if __name__ == "__main__":
    asyncio.run(main())
```

#### `local_test.py` (Optional)

This script shows the code for the optional local testing step.

```python
import asyncio
import vertexai
from vertexai import agent_engines
from multi_tool_agent.agent import root_agent

async def main():
    # Wrap the agent in an AdkApp object
    app = agent_engines.AdkApp(
        agent=root_agent,
        enable_tracing=True,
    )

    # Create a local session to maintain conversation history
    session = await app.async_create_session(user_id="u_123")
    print(f"Local session created: {session.id}")

    # Send a query to the agent
    events = []
    async for event in app.async_stream_query(
        user_id="u_123",
        session_id=session.id,
        message="Roll a 6-sided die.",
    ):
        events.append(event)

    # The full event stream shows the agent's thought process
    print("\n--- Full Event Stream ---")
sidebar_position: 3
    for event in events:
        print(event)

    # For quick tests, you can extract just the final text response
    final_text_responses = [
        e for e in events
        if e.get("content", {}).get("parts", [{}])[0].get("text")
        and not e.get("content", {}).get("parts", [{}])[0].get("function_call")
    ]
    if final_text_responses:
        print("\n--- Final Response ---")
sidebar_position: 3
        print(final_text_responses[0]["content"]["parts"][0]["text"])

if __name__ == "__main__":
    asyncio.run(main())
```