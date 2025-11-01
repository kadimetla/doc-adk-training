# Module 6: Running an Agent Programmatically

## Theory

### Beyond the Dev UI: Production Execution

While the `adk web` Dev UI is an excellent tool for interactive testing, debugging, and rapid prototyping, it's not designed for production use. To integrate your agent into a larger application, a backend service, or a custom user interface, you need to run it programmatically.

Running an agent programmatically means you are responsible for managing the components that the Dev UI handles automatically. This gives you complete control over the agent's lifecycle and how it integrates with your application.

### Core Components for Programmatic Execution

When you run an agent outside the Dev UI, you need to explicitly create and manage three key components:

1.  **The Runner (`InMemoryRunner`)**
    *   **Feature:** Oversight of agent execution.
    *   **Description:** The Runner is the engine responsible for the entire agent lifecycle. It receives the user's query, passes it to the agent, manages the event loop, and streams events (like the agent's final response or tool calls) back to your application. The `InMemoryRunner` is a simple, self-contained runner that manages sessions and artifacts in memory, making it perfect for single-instance applications or getting started.

2.  **The Session Service (`runner.session_service`)**
    *   **Feature:** Conversation history & shared state.
    *   **Description:** Sessions are crucial for maintaining conversational context. They store the history of messages and any stateful information the agent needs to remember between turns. When you create a runner, it automatically includes a session service. You use `runner.session_service.create_session()` to start a new conversation. While the `InMemoryRunner` uses a transient, in-memory session store, in a production environment you would replace this with a persistent database like Firestore or Spanner.

3.  **Structured Messages (`types.Content` and `types.Part`)**
    *   **Feature:** Structured, multimodal messages.
    *   **Description:** Instead of passing a simple string to the agent, you must package it in a structured `Content` object from the `google.genai` library. A `Content` object has a `role` (`'user'`, `'model'`, or `'tool'`) and a list of `parts`. Each `Part` can contain text, an image, or other data. This structure is what allows for rich, multimodal interactions with the underlying Gemini model.

### The Asynchronous Event Loop

The entire process is asynchronous. When you call `runner.run_async()`, you don't get a single response back. Instead, you get an asynchronous generator that yields `Event` objects as they happen.

Your application code will typically use an `async for` loop to iterate through these events and decide how to handle them. For a simple chatbot, you might just print the text from the final `'model'` response event. For a more complex application, you might inspect `'tool'` events to show a spinner in the UI while a tool is running.

To better visualize this flow, consider the following conceptual diagram:

```
$$\\text{User Query} \\xrightarrow{\\text{Runner}} \\text{Agent} \\xrightarrow{\\text{LLM/Tools}} \\text{Event Stream} \\xrightarrow{\\text{App Logic}} \\text{Response}$$
```

This highlights the Runner's central role as the orchestrator. For a more detailed visual explanation, refer to these diagrams:

![Event Loop Diagram](img/event-loop.png)

![Invocation Flow Diagram](img/invocation-flow.png)

By managing these components yourself, you gain the power to embed your ADK agent into any Python application, from a simple command-line interface to a complex, scalable web service.

### Key Takeaways
- Programmatic execution gives you full control over the agent's lifecycle for integration into custom applications.
- The `InMemoryRunner` is the engine that manages the agent's execution and event loop.
- The `runner.session_service` is used to create and manage sessions for conversational context.
- User messages must be packaged into structured `types.Content` and `types.Part` objects.
- The `runner.run_async()` method returns an asynchronous stream of `Event` objects that you process in a loop.
