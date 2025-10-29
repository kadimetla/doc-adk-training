---
# Module 3: Your First Agent: The "Echo" Agent

# Lab 3: Exercise

### Overview

Build your first AI agent with the Google Agent Development Kit (ADK). This lab starts from absolute zero. You'll create a simple "Echo" agent that takes any text you provide and repeats it back to you. This will teach you the fundamental workflow of creating, configuring, and running an agent. No prior ADK experience is needed!

### Prerequisites

*   You have successfully completed the setup in Module 2.
*   Your virtual environment is active.
*   You have authenticated with the gcloud CLI.
*   A Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey) or a configured Google Cloud project.

### Core Concepts

*   **Agent:** An AI assistant powered by a Large Language Model (LLM). It's a blueprint defining the agent's purpose (instructions), its model (e.g., Gemini), and its capabilities.
*   **`adk` CLI:** A command-line tool for creating and managing ADK projects.
*   **Dev UI:** An interactive web interface for testing and debugging your agents.

### Step 1: Create the Agent Project

We will use the `adk` command-line tool to create the file structure for our new agent.

1.  **Navigate to your training directory:**
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Create the agent project directly:**
    Run the following command to create a new agent named `echo-agent` using a configuration file.
    ```shell
    adk create --type=config echo-agent
    ```
    This command creates a new directory named `echo-agent/` with two files inside: `root_agent.yaml` and `.env`.

#### Alternative: Interactive Agent Creation

You can also create an agent using an interactive wizard.

1.  **Run the `adk create` command without the `--type` flag:**
    ```shell
    adk create echo-agent
    ```
2.  **Follow the prompts:**
    The wizard will ask what type of agent you want to create. Select the `Config-based` option. This will produce the same `echo-agent` directory and files.

### Step 2: Configure the Agent

Now, let's tell the agent how to behave and provide it with the necessary credentials.

1.  **Navigate into the agent directory:**
    ```shell
    cd echo-agent
    ```

2.  **Set up your API key:**
    Open the `.env` file. This file stores secret information like API keys.

    *   **For Google AI Studio API Key:**
        ```
        GOOGLE_GENAI_USE_VERTEXAI=0
        GOOGLE_API_KEY=<your-google-gemini-api-key>
        ```
    *   **For Google Cloud Vertex AI:**
        ```
        GOOGLE_GENAI_USE_VERTEXAI=1
        GOOGLE_CLOUD_PROJECT=<your_gcp_project>
        GOOGLE_CLOUD_LOCATION=us-central1
        ```

3.  **Define the agent's behavior (YAML method):**
    Open `root_agent.yaml` and replace its contents with this:

    ```yaml
    # yaml-language-server: $schema=https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json
    name: echo_agent
    model: gemini-2.5-flash
    description: An agent that repeats the user's input.
    instruction: You are an echo agent. Your only job is to repeat the user's input back to them exactly as they wrote it. Do not add any extra words or explanations.
    ```

### Alternative: Defining the Agent in Python

Instead of YAML, you can define your agent directly in a Python script. This is more flexible and required for advanced features.

1.  **Create an `agent.py` file** in the `echo-agent` directory.

2.  **Add the following code** to `agent.py`:
    ```python
    from google.adk.agents import LlmAgent

    root_agent = LlmAgent(
        name="echo_agent",
        model="gemini-2.5-flash",
        description="An agent that repeats the user's input.",
        instruction="You are an echo agent. Your only job is to repeat the user's input back to them exactly as they wrote it. Do not add any extra words or explanations."
    )
    ```
    This Python code defines the exact same agent. The ADK requires the variable to be named `root_agent`.

3.  **Delete the `root_agent.yaml` file.** The `adk` command will automatically find the `root_agent` object in `agent.py`.
    ```shell
    rm root_agent.yaml
    ```

### Step 3: Run the Agent

1.  **Start the ADK web server:**
    While inside the `echo-agent` directory, run:
    ```shell
    adk web
    ```
    You should see output indicating a server has started on `http://127.0.0.1:8080`.

2.  **Interact with your agent:**
    *   Open the URL in your web browser.
    *   In the chat interface, type "Hello, world!".
    *   The agent should respond with the exact same message: "Hello, world!".

### Understanding What's Happening

When you send a message:
1.  **ADK** packages your message with the agent's instructions.
2.  It sends the package to the **Gemini LLM**.
3.  **Gemini** generates a response based on the instructions.
4.  **ADK** returns the response to you.

**Use the Events tab** in the Dev UI to see this flow in detail!

### Key Takeaways

✅ **`adk create`** is the starting point for all agents.
✅ Agent behavior is defined by its **`instruction`**.
✅ **`.env`** keeps your API keys safe and out of code.
✅ You can define agents in **YAML** (simple) or **Python** (advanced).
✅ **`adk web`** is your primary tool for testing and debugging.

### Common Issues & Solutions

*   **Problem**: "Agent not found" or errors on startup.
    *   **Solution**: Make sure you are running `adk web` from *inside* the `echo-agent` directory.
*   **Problem**: "Authentication error".
    *   **Solution**: Double-check that your `.env` file is correctly configured with your API key or GCP project.
*   **Problem**: If using `agent.py`, "root_agent not found".
    *   **Solution**: Ensure your agent variable is named exactly `root_agent`.

## Lab Summary

Fantastic! You have successfully built and interacted with your first AI agent. You have learned the core development loop: Create, Configure, and Run.

In the next modules, you will learn how to give your agents more sophisticated instructions and powerful new capabilities.