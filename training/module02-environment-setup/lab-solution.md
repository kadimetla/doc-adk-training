---
sidebar_position: 3
title: "Lab Solution"
---

# Lab 2 Solution: Installation and Configuration

### Goal

This lab is a guided walkthrough of the essential steps for setting up a clean, isolated Python environment, installing the Google ADK, and authenticating with Google Cloud. By the end, your machine will be fully prepared to start building agents.

### Prerequisites

*   **Python 3.8 or higher:** To check your Python version, open your terminal and run `python3 --version`. If that command doesn't work, try `python --version`. If neither works, or the version is too old, download Python from the [official website](https://www.python.org/downloads/).
*   **Google Cloud Account or Google AI Studio API Key:** You will need one of these to access the Gemini API.

### Step 1: Create a Project Directory

First, let's create a dedicated folder for all the projects you'll be working on during this course.

```shell
mkdir adk-training
cd adk-training
```

### Step 2: Set Up a Python Virtual Environment

We will use `venv` to create an isolated environment for our project.

1.  **Create the virtual environment:**
    ```shell
    python3 -m venv .venv
    ```

2.  **Activate the virtual environment:**
    *   **macOS / Linux (bash/zsh):**
        ```shell
        source .venv/bin/activate
        ```
    *   **Windows (Command Prompt):**
        ```shell
        .venv\Scripts\activate.bat
        ```

    After activation, you should see `(.venv)` at the beginning of your terminal prompt.

### Step 3: Install Dependencies

With your virtual environment active, you can now safely install the ADK and the `dotenv` library for managing environment variables.

1.  **Install the packages using `pip`:
    ```shell
    pip install google-adk python-dotenv
    ```

2.  **Save your dependencies:**
    ```shell
    pip freeze > requirements.txt
    ```

### Step 4: Configure Authentication

Create a file named `.env` in your `adk-training` directory. This file will securely store your authentication credentials. Choose **one** of the two options below.

**Option A: Use a Google AI Studio API Key (Recommended for Beginners)**
1.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Add the following line to your `.env` file, replacing `YOUR_API_KEY` with the key you generated:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY"
    ```

**Option B: Use Vertex AI (Advanced)**
1.  Ensure you have a Google Cloud project with the Vertex AI API enabled.
2.  Authenticate with the gcloud CLI:
    ```shell
    gcloud auth application-default login
    ```
3.  Add the following lines to your `.env` file, replacing the placeholder values with your Google Cloud project details:
    ```
    GOOGLE_GENAI_USE_VERTEXAI="1"
    GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
    GOOGLE_CLOUD_LOCATION="us-central1"
    ```

### Step 5: Verify Your Setup

This script will load your `.env` file and use the credentials to test the connection to the LLM service via an ADK agent.

1.  Create a new file named `verify_setup.py` in your `adk-training` directory.
2.  Copy and paste the following code into the file:
    ```python
    # verify_setup.py
    import asyncio
    import os
    from dotenv import load_dotenv
    from google.adk.agents import LlmAgent
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.genai import types

    async def main():
        # Load environment variables from the .env file
        load_dotenv()

        try:
            print("✅ Google ADK is installed correctly.")
            print("Attempting to connect to the LLM service via an ADK agent...")

            # Define a simple ADK agent
            agent = LlmAgent(
                name="verify_agent",
                model="gemini-2.5-flash",
                instruction="You are a helpful assistant. Respond with a short confirmation."
            )

            # Use the ADK Runner to execute the agent
            runner = Runner(
                app_name="agents", # This must match the ADK's inferred app name
                agent=agent,
                session_service=InMemorySessionService()
            )
            session = await runner.session_service.create_session(
                app_name="agents", user_id="test_user"
            )
            message = types.Content(parts=[types.Part(text="hello")])

            # Stream the response from the agent
            final_response_text = "Agent did not produce a final response."
            async for event in runner.run_async(user_id="test_user", session_id=session.id, new_message=message):
                if event.is_final_response():
                    if event.content and event.content.parts:
                        final_response_text = event.content.parts[0].text
                    elif event.actions and event.actions.escalate:
                        final_response_text = f"Agent escalated: {event.error_message or 'No specific message.'}"
                    break

            if final_response_text != "Agent did not produce a final response.":
                print("✅ Authentication successful: Connected to the LLM service via ADK agent.")
                print(f"ADK agent response: {final_response_text}")
            else:
                print("❌ Authentication failed: Could not connect to the LLM service via ADK agent.")

        except ImportError:
            print("❌ Installation error: The 'google-adk' package could not be found.")
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")

    if __name__ == "__main__":
        asyncio.run(main())
    ```
3.  Run the script from your terminal:
    ```shell
    python verify_setup.py
    ```
    If everything is set up correctly, you should see a success message and a response from the LLM.

### Troubleshooting

*   **Authentication Errors:** Double-check that your `.env` file is correctly formatted and that the API key or project details are correct. Ensure there are no extra spaces or characters.
*   **`google-adk: command not found`**: Your virtual environment is likely not active. Make sure you see `(.venv)` at the start of your terminal prompt.
*   **`gcloud: command not found`**: The Google Cloud CLI is not installed. Follow the official instructions to [install the Google Cloud CLI](https://cloud.google.com/sdk/docs/install).

### Lab Summary

Congratulations! You have successfully:
*   Created and activated an isolated Python virtual environment.
*   Installed the Google ADK and other necessary packages.
*   Configured your authentication using a `.env` file.
*   Verified that your environment is ready for agent development.
