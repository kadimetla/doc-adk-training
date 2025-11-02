# Lab 35 Solution: Deploying the Calculator Agent

## Goal

This lab is a procedural tutorial. The solution for both parts is a successfully deployed Agent Engine instance.

---

### Part 1: Accelerated Deployment Solution

After running `gcloud builds submit --config=cloudbuild.yaml`, a successful Cloud Build run is the primary indicator of success.

**Expected Outcome:**
*   The Cloud Build pipeline in your Google Cloud project completes without errors.
*   A new agent named "calculator-agent" (or the `app_name` you configured) appears in the **Vertex AI -> Agent Engine** section of the Google Cloud Console.
*   You can copy the **Agent Engine ID** from the console to use with a client application.

---

### Part 2: Standard Deployment Solution

This section contains the complete code for the `deploy.py` and `interact.py` scripts used in the manual deployment part of the lab.

#### `calculator/agent.py`

```python
# Filename: calculator/agent.py
from google.adk.agents import Agent

def add(a: int, b: int) -> dict:
    """
    Adds two numbers together.
    Use this tool when the user asks to find the sum of two numbers.
    Args:
        a: The first number.
        b: The second number.
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
    """
    if b == 0:
        return {"status": "error", "message": "Cannot divide by zero."}
    result = a / b
    return {"status": "success", "result": result}

root_agent = Agent(
    model="gemini-2.5-flash",
    name="calculator_agent",
    description="An agent that can perform basic arithmetic calculations.",
    instruction=(
        "You are a helpful calculator assistant.\n"
        "When the user asks you to perform a calculation (add, subtract, multiply, or divide), you MUST use the appropriate tool.\n"
        "Clearly state the result of the calculation to the user.\n"
        "If the user asks a question that is not a calculation, politely state that you can only perform math."
    ),
    tools=[
        add,
        subtract,
        multiply,
        divide
    ]
)
```

#### `deployment/deploy.py`

```python
import vertexai
from vertexai import agent_engines
from calculator.agent import root_agent

# --- CONFIGURATION ---
# Note: Replace these with your actual Google Cloud project details.
PROJECT_ID = "your-gcp-project-id"
LOCATION = "us-central1"
STAGING_BUCKET = "gs://your-unique-bucket-name"
AGENT_DISPLAY_NAME = "my-calculator-agent"

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
        requirements=["google-adk>=1.0.0"],
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
    query = "What is 42 * 10?"
    print(f"\nUser: {query}")
    print("Agent: ", end="")
    
    async for event in remote_app.async_stream_query(
        session_id=remote_session["id"],
        message=query,
    ):
        for part in event["content"]["parts"]:
            print(part["text"], end="")
    print()

if __name__ == "__main__":
    asyncio.run(main())
```