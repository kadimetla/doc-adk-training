# Module 38: Introduction to UI Integration

## Lab 38: Building a Simple Custom Chat UI

### Goal

In this lab, you will build a very simple, standalone HTML file with JavaScript that acts as a custom chat client for an ADK agent. This will demonstrate the fundamental principles of connecting a UI to the ADK's native API server without relying on any front-end frameworks.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    ```shell
    adk create ui-agent
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd ui-agent
    ```

3.  **Implement the agent:**
    Open `agent.py` and replace its contents with a simple conversational agent.

    ```python
    from google.adk.agents import Agent

    root_agent = Agent(
        model="gemini-1.5-flash",
        name="ui_agent",
        instruction="You are a helpful and friendly assistant.",
    )
    ```

4.  **Set up your `.env` file** with your API key or Vertex AI project.

### Step 2: Create the Custom HTML/JavaScript Client

1.  **Create an `index.html` file** in the `ui-agent` directory.

2.  **Add the client code:**
    **Exercise:** Open `index.html` and paste in the full client code from the `lab-solution.md`.

    **Key things to study in the JavaScript:**
    *   **`sendMessage` function:** This is the core of the client.
    *   **`fetch` call:** It makes a `POST` request to the `/run_sse` endpoint that `adk api_server` provides. This is the native ADK streaming endpoint.
    *   **Streaming Response:** It uses the `ReadableStream` API to process the response chunk by chunk as it arrives from the server.
    *   **DOM Manipulation:** It dynamically creates new `div` elements to display the user's message and the agent's streaming response.

### Step 3: Run the Full-Stack Application

This requires two separate terminals.

1.  **Terminal 1: Start the ADK Agent Server**
    *   Navigate to the `ui-agent` directory.
    *   Run the `adk api_server`. This starts the agent as a headless backend service.

    ```shell
    adk api_server
    ```

2.  **Terminal 2: Start a Web Server for the Client**
    *   Navigate to the same `ui-agent` directory.
    *   Use Python's built-in web server to serve the `index.html` file.

    ```shell
    python3 -m http.server 8081
    ```

### Step 4: Test Your Custom UI

1.  **Open the Client:**
    In your web browser, navigate to `http://localhost:8081`. You should see your custom chat interface.

2.  **Chat with the Agent:**
    *   Type a message, like "Hello, what is the Google ADK?" and click "Send".
    *   You should see your message appear, followed by the agent's response streaming in token by token.

### Lab Summary

You have successfully built a full-stack agent application with a custom front-end!

You have learned:
*   How to run an ADK agent as a backend service using `adk api_server`.
*   How to connect a custom JavaScript client to the ADK's native `/run_sse` streaming endpoint.
*   The basic principles of handling streaming responses in a web UI.
*   How to create a complete, interactive experience for your agent, independent of the ADK Dev UI.
