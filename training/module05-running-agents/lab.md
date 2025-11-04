# Lab 5: Exploring Different Execution Modes Challenge

## Goal
Your task is to run and interact with your "Haiku Poet" agent using the three primary execution modes provided by the ADK CLI from your main `adk-training` directory.

## Requirements
1.  **`adk web`:**
    *   Run your agent using the `adk web haiku-poet-agent` command.
    *   Interact with it in the Dev UI and inspect the "Trace" view to see the full prompt sent to the LLM.
2.  **`adk run`:**
    *   Stop the web server.
    *   Run your agent using the `adk run haiku-poet-agent` command.
    *   Interact with the agent directly in your terminal.
3.  **`adk api_server`:**
    *   Stop the command-line runner.
    *   Run your agent using the `adk api_server` command.
    *   From a separate terminal, use `curl` to first create a session and then send a POST request to the `/run_sse` endpoint to verify that you get a valid response from the agent.

### Self-Reflection Questions
- In what scenarios would the detailed "Trace View" in `adk web` be more useful than the simple chat interface of `adk run`?
- The `curl` command in the `adk api_server` section is a simple example of a programmatic client. What kind of real-world applications could you build that would interact with your agent's API in this way?
- Why is it necessary to run the `adk api_server` and the `curl` command in two separate terminal windows? What does this separation represent in a real-world application architecture?
