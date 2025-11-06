# Lab 5 Solution: Exploring Different Execution Modes

## Goal

In this lab, you will learn how to run and interact with your "Haiku Poet" agent using the three primary execution modes provided by the ADK CLI: `adk web`, `adk run`, and `adk api_server`.

## Prerequisites

*   You have successfully completed Module 4.
*   You have the `haiku-poet-agent` configured in your `adk-training` directory.
*   Your virtual environment is active.

## Part 1: Interactive Development with `adk web`

This is the mode you've used so far. Let's explore its features more deeply.

1.  **Navigate to your project directory:**
    Make sure you are in your main `adk-training` directory.
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Start the web UI:**
    Run the command from the parent directory, specifying which agent you want to run.
    ```shell
    adk web haiku-poet-agent
    ```

3.  **Explore the Dev UI:**
    *   Open the UI in your browser (`http://127.0.0.1:8080`).
    *   Have a short conversation with your poet agent.
    *   **Trace View:** On the right side of the screen, click on the "Trace" tab. You will see a waterfall diagram. Click on the `LlmAgent` step to expand it. Here you can see the full prompt sent to the Gemini model, including your detailed instruction and the user's message. This view is critical for debugging why an agent behaves a certain way.
    *   **State View:** Click the "State" tab. This view shows the agent's short-term memory for the current conversation. We will explore this more in later modules.

## Part 2: Headless Interaction with `adk run`

Now, let's chat with the agent directly in the terminal.

1.  **Stop the web server:**
    Go back to your terminal where `adk web` is running and press `Ctrl+C` to stop it.

2.  **Start the command-line runner:**
    Again, run this from the parent `adk-training` directory.
    ```shell
    adk run haiku-poet-agent
    ```

3.  **Chat with the agent:**
    *   You will see a prompt like `[user]:`.
    *   Type a message, for example: `I'm learning about AI agents.`
    *   The agent will respond directly in the terminal with a haiku.
    *   You can have a continuous conversation.
    *   To exit, press `Ctrl+C`.

## Part 3: Running as a Service with `adk api_server`

Finally, let's run the agent as a background service that other applications could talk to.

1.  **Start the API server:**
    From the `adk-training` directory, run:
    ```shell
    adk api_server
    ```
    The server will start and listen for HTTP requests, similar to `adk web`, but without the UI.

2.  **Interact with the API:**
    *   Open a **new, separate terminal window**. You need a new window because the API server is currently running in and occupying your first one.
    *   We will use the `curl` command to send HTTP requests to our agent.

    *   **First, create a session.** This establishes a unique conversation context. Copy and paste the following command into the **new** terminal and press Enter:
        ```shell
        curl -X POST http://127.0.0.1:8000/apps/haiku-poet-agent/users/test_user/sessions/test_session
        ```
        You should receive a simple `{"status": "ok"}` response.

    *   **Next, send a message to the agent within that session.** Copy and paste the following command into the same new terminal:
        ```shell
        curl -X POST http://127.0.0.1:8000/run_sse \
             -H "Content-Type: application/json" \
             -d '{
                   "app_name": "haiku-poet-agent",
                   "user_id": "test_user",
                   "session_id": "test_session",
                   "new_message": {
                     "role": "user",
                     "parts": [{
                       "text": "A beautiful sunset."
                     }]
                   }
                 }'
        ```

    **Understanding the `curl` commands:**
    *   The first command uses the agent's folder name (`haiku-poet-agent`) and some placeholder IDs (`test_user`, `test_session`) to create a unique session endpoint.
    *   The second command sends a JSON payload to the `/run_sse` endpoint, referencing the *same* `app_name`, `user_id`, and `session_id` to continue the conversation we just created.

3.  **Analyze the Output:**
    You will see a stream of JSON objects as the response. This is the raw event data that the Dev UI uses to render the chat and trace views. Look through the output, and you will find the agent's final haiku response.

4.  **Stop the API server:**
    Go back to the first terminal where the `api_server` is running and press `Ctrl+C`.

## Lab Summary

You have now mastered the three ways to run an ADK agent:

*   `adk web <agent_name>`: For interactive development and deep debugging with the Trace View.
*   `adk run <agent_name>`: For quick tests and automated scripting in the terminal.
*   `adk api_server <agent_name>`: For running your agent as a service to be integrated with other applications.

This completes the foundational part of the course. You are now ready to start extending your agent's capabilities with tools.
