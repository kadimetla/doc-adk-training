# Module 8: Introduction to Tools

## Lab 8: Creating a "Researcher" Agent with Google Search Challenge

### Goal
Your task is to build and configure a new agent that can search the web to answer questions about current events.

### Requirements

1.  **Create a new agent** named `researcher-agent` using the `adk create` command.
2.  **Enable the Vertex AI API** in your Google Cloud project.
3.  **Configure the `.env` file** inside the `researcher-agent` directory to use Vertex AI, providing your project ID and a location.
4.  **Modify the `root_agent.yaml` file:**
    *   Set the `model` to `gemini-2.5-flash`.
    *   Write a clear `instruction` that directs the agent to use a search tool for any questions about recent or up-to-date information.
    *   Add the `google_search` tool to the `tools` section.
5.  **Run the agent** from your main `adk-training` directory using the `adk web researcher-agent` command.
6.  **Test the agent** by asking it a question about a recent event (e.g., "Who won the last major sports championship?").
7.  **Verify** that the `google_search` tool was used by inspecting the "Trace" view in the Dev UI.