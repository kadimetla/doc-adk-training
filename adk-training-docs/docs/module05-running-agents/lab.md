# Lab 5: Exploring Different Execution Modes Challenge

## Goal
Your task is to run and interact with your "Pirate Translator" agent using the three primary execution modes provided by the ADK CLI.

## Requirements
1.  **`adk web`:**
    *   Run your agent using the `adk web` command.
    *   Interact with it in the Dev UI and inspect the "Trace" view to see the full prompt sent to the LLM.
2.  **`adk run`:**
    *   Stop the web server.
    *   Run your agent using the `adk run` command.
    *   Interact with the agent directly in your terminal.
3.  **`adk api_server`:**
    *   Stop the command-line runner.
    *   Run your agent using the `adk api_server` command.
    *   From a separate terminal, use `curl` to send a POST request to the `/run_sse` endpoint and verify that you get a valid response from the agent.
