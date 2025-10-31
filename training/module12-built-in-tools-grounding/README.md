# Module 12: Built-in Tools and Grounding

## Theory

### Why Built-in Tools Matter

Traditional AI models have a knowledge cutoff date—they don't know about recent events, current news, or real-time information. Built-in tools solve this by allowing models to **ground** their responses in current web data.

**Key Advantages**:
*   **Current Information:** Access to up-to-date web content.
*   **No Local Execution:** Tools run inside the model's environment, requiring no local code execution or infrastructure from you.
*   **Automatic Integration:** The LLM seamlessly incorporates the search results into its final response.
*   **Production Ready:** These tools are used by real-world, production applications.

**Important:** Built-in tools are a feature of Gemini 2.0 and newer models and will raise errors with older versions.

### `google_search`: Web Grounding

The `google_search` tool is a built-in capability that allows a Gemini 2.0+ model to search the web to find information. When you add this tool to your agent, the model can autonomously decide to use it when a user's query requires current information.

The search itself is executed within the model's environment. The results are then used by the model to formulate its answer, and information about the searches performed is available in the `GroundingMetadata`.

### `google_maps_grounding`: Location-Based Queries

The `google_maps_grounding` tool enables agents to answer location-based queries, such as finding nearby places, getting directions, or understanding geographic context. This tool is currently only available when using the **Vertex AI API**.

### The `GoogleSearchAgentTool` Workaround

A current limitation of the ADK is that built-in tools (like `google_search`) cannot be directly combined with custom function tools in the same agent's `tools` list.

To overcome this, the ADK provides the `GoogleSearchAgentTool`. This is a special wrapper that creates a sub-agent with the `google_search` tool and exposes that sub-agent as a regular `FunctionTool`. This allows you to build a primary agent that can use both your own custom tools and the powerful web search capabilities of the wrapped `google_search` agent.

### Key Takeaways
- Built-in tools like `google_search` allow agents to access real-time information from the web, overcoming the knowledge cutoff of the LLM.
- These tools run within the model's environment, requiring no local code execution.
- To combine built-in tools with your own custom function tools, you must use a wrapper like the `GoogleSearchAgentTool`.
