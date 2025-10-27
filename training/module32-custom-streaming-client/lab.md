# Module 32: Building a Custom Streaming Client

## Lab 32: Interacting with a Custom Voice Client

### Goal

In this lab, you will run an ADK agent as a backend API server and interact with it using a custom, standalone HTML/JavaScript client. This will demonstrate how to build your own user-facing applications on top of the ADK's streaming capabilities.

### Step 1: Prepare the Streaming Agent

We will use the same streaming agent configuration from Module 22.

1.  **Create the project directory and agent:**
    ```shell
    mkdir custom-streaming-app
    cd custom-streaming-app
    adk create --type=config streaming_agent
    ```

2.  **Configure the agent:**
    *   Navigate into `streaming_agent`.
    *   Configure the `.env` file for **Vertex AI**.
    *   Replace the contents of `root_agent.yaml` with:
        ```yaml
        name: streaming_conversational_agent
        model: gemini-1.5-flash
        instruction: |
          You are a friendly and talkative assistant. Keep your answers concise.
        streaming: True
        ```

### Step 2: Create the Custom HTML/JavaScript Client

**Exercise:** Navigate back to the `custom-streaming-app` directory. Create an `index.html` file. A skeleton is provided below. Your task is to complete the JavaScript logic for the `startStreaming` function based on the `# TODO` comments.

```html
<!-- In index.html (Starter Code) -->
<!DOCTYPE html>
<html>
<head>
    <title>ADK Custom Streaming Client</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; }
        #transcript { width: 500px; height: 300px; border: 1px solid #ccc; padding: 10px; overflow-y: scroll; }
        button { margin: 10px; padding: 10px; font-size: 16px; }
    </style>
</head>
<body>
    <h1>ADK Custom Streaming Client</h1>
    <button id="streamButton">Start Streaming</button>
    <div id="transcript"></div>

    <script>
        const streamButton = document.getElementById('streamButton');
        const transcriptDiv = document.getElementById('transcript');
        let websocket;
        let mediaRecorder;
        let isStreaming = false;

        // (Helper functions log() and stopStreaming() are in the solution)

        async function startStreaming() {
            try {
                // TODO: 1. Get microphone access using `navigator.mediaDevices.getUserMedia({ audio: true })`.
                const mediaStream = null; // Replace null
                
                // TODO: 2. Create a WebSocket connection to the ADK server.
                // The URL should be `ws://localhost:8000/live/<session_id>?is_audio=true`.
                // Generate a random session_id.
                websocket = null; // Replace null

                websocket.onopen = () => {
                    // TODO: 3. Start the MediaRecorder.
                    // - Create a new MediaRecorder with the mediaStream.
                    // - In the `ondataavailable` event, send the `event.data` over the websocket.
                    // - Call `mediaRecorder.start(100)` to send audio every 100ms.
                };

                websocket.onmessage = (event) => {
                    // TODO: 4. Handle incoming messages from the server.
                    // - Parse the JSON data from `event.data`.
                    // - If the `mime_type` is 'text/plain', log the `data.data` to the transcript.
                };

                // (onclose and onerror handlers are in the solution)

            } catch (error) {
                console.error("Error starting stream:", error);
            }
        }
    </script>
</body>
</html>
```

### Step 3: Run the Server and the Client

1.  **Terminal 1 (ADK Server):**
    *   Navigate to the `streaming_agent` directory.
    *   Run `adk api_server`.
    ```shell
    cd /path/to/custom-streaming-app/streaming_agent
    adk api_server
    ```

2.  **Terminal 2 (Client Web Server):**
    *   Navigate to the `custom-streaming-app` directory (where `index.html` is).
    *   Start a simple Python web server.
    ```shell
    cd /path/to/custom-streaming-app
    python3 -m http.server 8081
    ```

### Step 4: Test Your Custom Application

1.  **Open the Client:** In your browser, navigate to `http://localhost:8081`.
2.  **Start Streaming:** Click the "Start Streaming" button and allow microphone access.
3.  **Talk to the Agent:** Speak into your microphone and watch the transcript area for the agent's real-time text response.

### Having Trouble?
If you get stuck, you can find the complete, working `index.html` code in the `lab-solution.md` file.

### Lab Summary
You have successfully built a custom client for a streaming ADK agent. You have learned:
*   How to run an ADK agent as a backend service using `adk api_server`.
*   The basic structure of an HTML/JavaScript client for streaming.
*   How to use the `WebSocket` and Web Audio APIs to create a real-time voice application.