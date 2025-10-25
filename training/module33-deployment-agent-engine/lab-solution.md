# Module 28: Deploying to Agent Engine

## Lab 28: Solution

This file contains the complete code for the `deploy.py` and `interact.py` scripts used in the lab.

### `deployment/deploy.py`

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
        # The SDK automatically packages the local 'calculator' module
        requirements=["google-adk>=1.0.0"],
    )

    print(f"Deployment complete. Resource Name: {remote_app.resource_name}")
    print(f"Agent Engine ID: {remote_app.resource_name.split('/')[-1]}")

if __name__ == "__main__":
    main()
```

### `interact.py`

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
