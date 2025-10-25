# Module 10: OpenAPI Tools

## Lab 10: Building a Chuck Norris Fact Assistant

### Goal

In this lab, you will build an agent that can retrieve Chuck Norris jokes from a public REST API. You will learn how to use the `OpenAPIToolset` to automatically generate the necessary tools from an OpenAPI specification, without writing any tool functions manually.

### Step 1: Create the Agent Project

1.  **Navigate to your training directory:**
    ```shell
    cd /path/to/your/adk-training
    ```

2.  **Create the agent project:**
    ```shell
    adk create chuck-norris-agent
    ```
    When prompted, select the **Programmatic (Python script)** option.

### Step 2: Configure the Environment

1.  **Navigate into the agent directory:**
    ```shell
    cd chuck-norris-agent
    ```
2.  **Set up your API key** in the `.env` file. The Chuck Norris API is free and doesn't require a key, but the agent still needs credentials to communicate with the Gemini model.

### Step 3: Implement the Agent and OpenAPI Toolset

**Exercise:** Open `agent.py` and replace its contents with the code from the `lab-solution.md`.

Your task is to study this code and understand its key components:

1.  **`CHUCK_NORRIS_SPEC` Dictionary:**
    *   This is a Python dictionary that contains the OpenAPI v3 specification for the Chuck Norris API.
    *   Examine the `paths` section. Notice how each endpoint (`/random`, `/search`, `/categories`) has an `operationId` (e.g., `get_random_joke`) and a `parameters` list. This is what the ADK will use to generate the tools.

2.  **`OpenAPIToolset` Instantiation:**
    *   A single line of code creates the toolset: `chuck_norris_toolset = OpenAPIToolset(spec_dict=CHUCK_NORRIS_SPEC)`.
    *   Based on the spec, the ADK will automatically generate three tools: `get_random_joke`, `search_jokes`, and `get_categories`.

3.  **Agent Definition:**
    *   The `instruction` prompt is written to guide the LLM on when to use the newly available tools.
    *   The `chuck_norris_toolset` is passed directly into the agent's `tools` list.

### Step 4: Run and Test Your Agent

1.  **Navigate to the parent directory** of your `chuck-norris-agent` project.
    ```shell
    cd ..
    ```

2.  **Start the Dev UI:**
    ```shell
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "chuck_norris_agent".
    *   Test the agent's capabilities with natural language.

    **Try these prompts:**
    *   "Tell me a random Chuck Norris joke"
    *   "Find jokes about computers"
    *   "What joke categories exist?"
    *   "Give me a random movie joke"

4.  **Explore the Events Tab:**
    For each query, inspect the Events tab. You will see the `FunctionCall` events for the auto-generated tools (`get_random_joke`, `search_jokes`, etc.) and the corresponding `FunctionResponse` containing the data from the live API.

### Lab Summary

You have successfully integrated a live REST API into your agent without writing a single manual tool function. You have learned:
*   What an OpenAPI specification is.
*   How to use `OpenAPIToolset` to automatically generate tools from a spec.
*   How to instruct your agent to use the new, auto-generated tools.
*   How to verify API tool calls using the Dev UI.