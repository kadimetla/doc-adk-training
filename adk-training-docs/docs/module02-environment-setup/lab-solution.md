# Module 2: Setting Up Your Development Environment

# Lab 2: Exercise

### Goal

This lab is a guided walkthrough of the essential steps for setting up a clean, isolated Python environment, installing the Google ADK, and authenticating with Google Cloud. By the end, your machine will be fully prepared to start building agents.

### Prerequisites

*   **Python 3.8 or higher:** To check your Python version, open your terminal and run `python3 --version`. If that command doesn't work, try `python --version`. If neither works, or the version is too old, download Python from the [official website](https://www.python.org/downloads/).
*   **Google Cloud Account:** You will need a Google Cloud account to access the Gemini API. If you don't have one, you can sign up for a free trial.

### Step 1: Create a Project Directory

First, let's create a dedicated folder for all the projects you'll be working on during this course.

```shell
mkdir adk-training
cd adk-training
```

### Step 2: Set Up a Python Virtual Environment

We will use `venv` to create an isolated environment for our project.

1.  **Create the virtual environment:**

    Run the following command inside your `adk-training` directory. This creates a sub-directory named `.venv` which will contain the isolated Python environment.

    ```shell
    python3 -m venv .venv
    ```

2.  **Activate the virtual environment:**

    You must activate the environment to start using it. The command differs based on your operating system.

    *   **macOS / Linux (bash/zsh):**
        ```shell
        source .venv/bin/activate
        ```
    *   **Windows (Command Prompt):**
        ```shell
        .venv\Scripts\activate.bat
        ```
    *   **Windows (PowerShell):**
        ```shell
        .venv\Scripts\Activate.ps1
        ```

    After activation, you should see `(.venv)` at the beginning of your terminal prompt. To exit the environment at any time, simply run the command `deactivate`.

### Step 3: Install the Google ADK

With your virtual environment active, you can now safely install the ADK.

1.  **Install the package using `pip`:**

    ```shell
    pip install google-adk
    ```
    `pip` is the Python package installer, and this command downloads and installs the latest version of the ADK and its required dependencies into your `.venv`.

2.  **Save your dependencies:**
    To make your project reproducible, save the list of installed packages to a `requirements.txt` file.
    ```shell
    pip freeze > requirements.txt
    ```

### Step 4: Authenticate with Google Cloud

Finally, let's authorize your local environment to use Google Cloud services.

1.  **Install the Google Cloud CLI:**

    If you don't have it installed, follow the official instructions to [install the Google Cloud CLI](https://cloud.google.com/sdk/docs/install).

2.  **Log in and create Application Default Credentials:**

    Run the following command in your terminal:

    ```shell
    gcloud auth application-default login
    ```

    This command will open a web browser and prompt you to log in with your Google account. After you approve the permissions, the gcloud CLI will store authentication credentials on your local machine. The ADK will automatically find and use these credentials to make secure API calls.

### Step 5: Verify Your Setup (Optional but Recommended)

To provide a more robust confirmation that the environment is working, you can run a small Python script to actively check the ADK installation and authentication.

1.  Create a new file named `verify_setup.py` in your `adk-training` directory.
2.  Copy and paste the following code into the file:
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
3.  Run the script from your terminal (make sure your virtual environment is still active):
    ```shell
    python verify_setup.py
    ```
    If everything is set up correctly, you should see two success messages.

### Troubleshooting

If you encountered issues, here are some common solutions:

*   **`python3: command not found` or `python: command not found`**:
    *   This means Python is not installed or not available in your system's PATH. Please download and install it from the [official Python website](https://www.python.org/downloads/).

*   **`gcloud: command not found`**:
    *   The Google Cloud CLI is not installed. Follow the official instructions to [install the Google Cloud CLI](https://cloud.google.com/sdk/docs/install).

*   **Permissions error during `pip install`**:
    *   This most likely means your virtual environment is **not active**. Make sure you see `(.venv)` at the start of your terminal prompt. If not, re-run the activation command for your operating system.

*   **`pip freeze > requirements.txt` creates an empty file**:
    *   Ensure your virtual environment is active. If it is, run `pip install google-adk` again to ensure the package is installed in the correct environment.

# Lab Summary

Congratulations! You have successfully:

*   Created and activated an isolated Python virtual environment.
*   Installed the Google ADK package and saved your dependencies.
*   Authenticated your machine with Google Cloud.
*   Verified that your environment is ready for agent development.

Your development environment is now ready. In the next module, you will use this setup to create and run your very first AI agent.