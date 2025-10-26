# Module 28: Deploying to Agent Engine

## Lab 28: Deploying the Calculator Agent

### Goal

In this lab, you will take the `calculator-agent` and deploy it to a live, scalable environment using Google Cloud's Agent Engine. You will learn how to package your agent, create a deployment script, and interact with the deployed agent via the Vertex AI SDK.

### Prerequisites

1.  **Google Cloud Project:**
    *   You must have a Google Cloud project with **billing enabled**.
    *   The **Vertex AI API** must be enabled. You can do this by navigating to the Vertex AI section in the Google Cloud Console.

2.  **Google Cloud CLI:**
    *   Install the `gcloud` CLI by following the [official instructions](https://cloud.google.com/sdk/docs/install).
    *   Authenticate the CLI with your Google account:
        ```shell
        gcloud auth application-default login
        ```
    *   Set your project configuration:
        ```shell
        gcloud config set project YOUR_PROJECT_ID
        ```

3.  **Google Cloud Storage (GCS) Bucket:**
    *   Create a GCS bucket in the same region you plan to deploy your agent (e.g., `us-central1`). This bucket will be used for staging the deployment files.
        ```shell
        gsutil mb -p YOUR_PROJECT_ID -l us-central1 gs://YOUR_UNIQUE_BUCKET_NAME
        ```

### Step 1: Prepare the Agent Project

1.  **Navigate to your training directory:**
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Copy the Calculator Agent project:**
    ```shell
    cp -r module07-custom-function-tools/calculator-agent/ deploy-calculator/
    cd deploy-calculator/
    ```

3.  **Update Dependencies:**
    Agent Engine deployment requires the `google-cloud-aiplatform` package with specific extras. Open `pyproject.toml` and add it to your `dependencies`:

    ```toml
    [project]
    # ... other project settings ...
    dependencies = [
        "google-adk>=1.0.0",
        "google-cloud-aiplatform[adk,agent-engines]>=1.111.0"
    ]
    ```
    Then, sync your environment:
    ```shell
    uv sync
    ```

### Step 2: Create the Deployment Script

1.  **Create a `deployment` directory and a `deploy.py` file:**
    ```shell
    mkdir deployment
    touch deployment/deploy.py
    ```

2.  **Add the deployment code to `deployment/deploy.py`:**
    This script will handle packaging and deploying your agent.

    **Exercise:** Fill in the `PROJECT_ID`, `LOCATION`, and `STAGING_BUCKET` variables with your own Google Cloud project details.

    ```python
    import vertexai
    from vertexai import agent_engines
    from calculator.agent import root_agent

    # --- CONFIGURATION ---
    # TODO: Fill in your Google Cloud project details here.
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

    if __name__ == "__main__":
        main()
    ```

### Step 3: Deploy the Agent

1.  **Run the deployment script:**
    This process will take several minutes as it packages, uploads, and builds the container for your agent.

    ```shell
    uv run python deployment/deploy.py
    ```

2.  **Verify Deployment:**
    *   Once the script finishes, it will print the `Resource Name` of your deployed agent.
    *   You can also go to the Google Cloud Console, navigate to **Vertex AI -> Agent Engine**, and you should see your `my-calculator-agent` listed.

### Step 4: Interact with the Deployed Agent

1.  **Create an `interact.py` script** in the root of your `deploy-calculator` directory.

2.  **Add the following code to `interact.py`:**
    This script shows how to connect to the deployed agent and send it a query.

    **Exercise:** Replace `YOUR_AGENT_ENGINE_ID` with the ID from the deployment output or the Cloud Console.

    ```python
    import asyncio
    import vertexai
    from vertexai import agent_engines

    # --- CONFIGURATION ---
    PROJECT_ID = "your-gcp-project-id"
    LOCATION = "us-central1"
    AGENT_ENGINE_ID = "YOUR_AGENT_ENGINE_ID" # e.g., "1234567890123456789"

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

3.  **Run the interaction script:**
    ```shell
    uv run python interact.py
    ```
    You should see the agent process your request and stream back the correct answer, "The result is 420."

### Step 5: Clean Up

To avoid incurring charges, delete the deployed agent.

1.  **Go to the Google Cloud Console -> Vertex AI -> Agent Engine.**
2.  **Select your agent** (`my-calculator-agent`).
3.  **Click the "Delete" button.**

### Lab Summary

Congratulations! You have successfully deployed a local ADK agent to a fully managed, scalable environment on Google Cloud. You have learned to:
*   Configure a project for Agent Engine deployment.
*   Create a deployment script using the Vertex AI SDK.
*   Package and deploy an agent from your local machine.
*   Interact with the deployed agent programmatically.
*   Clean up cloud resources.
