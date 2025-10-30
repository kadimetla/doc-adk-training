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
try:
    from google.adk.discover import get_default_llm
    print("✅ Google ADK is installed correctly.")
    
    print("Attempting to connect to the LLM service...")
    llm = get_default_llm()
    if llm:
        print("✅ Authentication successful: Connected to the LLM service.")
    else:
        print("❌ Authentication failed: Could not connect to the LLM service.")
        
except ImportError:
    print("❌ Installation error: The 'google-adk' package could not be found.")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
```