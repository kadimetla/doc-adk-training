# Module 11: Built-in Tools and Grounding

## Lab 11: Building a Research Assistant with Web Search

### Goal

In this lab, you will build a **Research Assistant** that can access up-to-date information from the internet. You will learn how to use the `google_search` built-in tool and the `GoogleSearchAgentTool` wrapper to combine web search with your own custom tools.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create research-assistant
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd research-assistant
    ```

### Step 2: Define the Agent and Tools

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study the code and understand its key components:

1.  **Custom Tools (`save_research_notes`, `extract_key_facts`):**
    *   These are standard Python functions that will act as our custom tools. `save_research_notes` demonstrates how to save data as an artifact, a topic we will cover in more detail later.

2.  **`GoogleSearchAgentTool`:**
    *   Notice the line `search_tool = GoogleSearchAgentTool()`. This creates the wrapper that allows us to use `google_search` alongside our custom tools.

3.  **Agent Definition:**
    *   The `research_assistant` agent is an `LlmAgent`.
    *   Its `tools` list contains both the wrapped `search_tool` and our custom `FunctionTool`s.
    *   The `instruction` prompt guides the agent on how to orchestrate these tools: first search, then extract facts, then save the results.

### Step 3: Run and Test the Research Assistant

1.  **Set up your `.env` file for Vertex AI.** The `google_search` tool requires a Vertex AI configuration.

2.  **Start the Dev UI:**
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the agent:**
    *   Open `http://localhost:8080` and select "research_assistant".
    *   Give the agent a research topic that requires current information.

    **Try these prompts:**
    *   "What are the latest developments in quantum computing in 2025?"
    *   "Summarize the most recent news about renewable energy technology."

4.  **Analyze the Trace View:**
    *   Expand the trace for your query. You will see a sequence of tool calls.
    *   First, the agent will call the `GoogleSearchAgentTool`.
    *   Next, it will call `extract_key_facts` to process the search results.
    *   Finally, it will call `save_research_notes` to save the output.
    *   This demonstrates how the agent can combine built-in and custom tools to perform a complex, multi-step task.

### Lab Summary

You have successfully built an agent that can access real-world, current information from the internet and process it using custom logic. You have learned:
*   How to use the `google_search` tool for web grounding.
*   How to use the `GoogleSearchAgentTool` wrapper to combine built-in search with custom `FunctionTool`s.
*   How to write an instruction that orchestrates a sequence of different tool types.