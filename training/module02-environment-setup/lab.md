# Lab 2: Environment Setup Challenge

## Goal
Your task is to prepare your local machine for agent development. Try to complete the steps below using your existing knowledge. If you get stuck, the `lab-solution.md` file provides a detailed, step-by-step walkthrough.

## Requirements
1.  Create a project directory named `adk-training`.
2.  Inside it, create and activate a Python virtual environment.
3.  Install the `google-adk` package.
4.  Save the project dependencies to a `requirements.txt` file.
5.  Authenticate with Google Cloud using the gcloud CLI.
6.  Verify your setup by creating a `verify_setup.py` file with the code below and running it successfully.

### Verification Script

Create a file named `verify_setup.py` and add the following content:

```python
# verify_setup.py
import asyncio
from google.adk.agents import LlmAgent

async def main():
    try:
        print("✅ Google ADK is installed correctly.")
        print("Attempting to connect to the LLM service...")

        agent = LlmAgent(name="verify_agent", model="gemini-2.5-flash", instruction="You are a helpful assistant.")

        response = await agent.invoke("hello")

        if response:
            print("✅ Authentication successful: Connected to the LLM service.")
            print(f"LLM response: {response}")
        else:
            print("❌ Authentication failed: Could not connect to the LLM service.")

    except ImportError:
        print("❌ Installation error: The 'google-adk' package could not be found.")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```